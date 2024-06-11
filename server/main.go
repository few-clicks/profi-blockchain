package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/go-kivik/couchdb/v3"
	"github.com/go-kivik/kivik/v3"
	"github.com/joho/godotenv"
)

type Item struct {
    ID          string `json:"_id,omitempty"`
    Rev         string `json:"_rev,omitempty"`
    ContractId  string `json:"contractId"`
    Title       string `json:"title"`
    Description string `json:"description"`
}

var client *kivik.Client
var db *kivik.DB
var dbName = "itemsdb"

func main() {
    loadEnv()
    time.Sleep(3 * time.Second)
    initDb()

    http.HandleFunc("/", corsMiddleware(getAllItems))
    http.HandleFunc("/item", corsMiddleware(createItem))
    http.HandleFunc("/item/", corsMiddleware(itemHandler))

    fmt.Println("Server is running on port 9000")
    log.Fatal(http.ListenAndServe(":9000", nil))
}

func loadEnv() {
    if err := godotenv.Load(); err != nil {
        log.Fatalf("Error loading .env file: %v", err)
    }
}

func initDb() {
    var err error
    couchDBURL := os.Getenv("COUCHDB_URL")
    if couchDBURL == "" {
        log.Fatalf("COUCHDB_URL is not set in .env file")
    }

    client, err = kivik.New("couch", couchDBURL)
    if err != nil {
        log.Fatalf("Failed to connect to CouchDB: %v", err)
    }

    if err = client.CreateDB(context.TODO(), dbName); err != nil && err.Error() != "Precondition Failed: The database could not be created, the file already exists." {
        log.Fatalf("Failed to create database: %v", err)
    }

    db = client.DB(context.TODO(), dbName)
    if db.Err() != nil {
        log.Fatalf("Failed to open database: %v", db.Err())
    }
}

func createItem(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    var item Item
    if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
        http.Error(w, fmt.Sprintf("Failed to decode item: %v", err), http.StatusBadRequest)
        return
    }

    item.ID = generateRandomID(32)
    rev, err := db.Put(context.TODO(), item.ID, item)
    if err != nil {
        http.Error(w, fmt.Sprintf("Failed to create item: %v", err), http.StatusInternalServerError)
        return
    }

    item.Rev = rev
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    if err := json.NewEncoder(w).Encode(item); err != nil {
        http.Error(w, fmt.Sprintf("Failed to encode item: %v", err), http.StatusInternalServerError)
    }
}

func itemHandler(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Path[len("/item/"):]
    switch r.Method {
    case http.MethodGet:
        getItem(w, r, id)
    case http.MethodDelete:
        deleteItem(w, r, id)
    case http.MethodPut:
        updateItem(w, r, id)
    default:
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}

func getItem(w http.ResponseWriter, r *http.Request, id string) {
    var item Item
    if err := db.Get(context.TODO(), id).ScanDoc(&item); err != nil {
        http.Error(w, fmt.Sprintf("Failed to get item: %v", err), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(item); err != nil {
        http.Error(w, fmt.Sprintf("Failed to encode item: %v", err), http.StatusInternalServerError)
    }
}

func deleteItem(w http.ResponseWriter, r *http.Request, id string) {
    var item Item
    if err := db.Get(context.TODO(), id).ScanDoc(&item); err != nil {
        http.Error(w, fmt.Sprintf("Failed to get item: %v", err), http.StatusInternalServerError)
        return
    }

    if _, err := db.Delete(context.TODO(), item.ID, item.Rev); err != nil {
        http.Error(w, fmt.Sprintf("Failed to delete item: %v", err), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}

func getAllItems(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    rows, err := db.AllDocs(context.TODO(), kivik.Options{"include_docs": true})
    if err != nil {
        http.Error(w, fmt.Sprintf("Failed to get all items: %v", err), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var items []Item
    for rows.Next() {
        var item Item
        if err := rows.ScanDoc(&item); err != nil {
            http.Error(w, fmt.Sprintf("Failed to scan item: %v", err), http.StatusInternalServerError)
            return
        }
        items = append(items, item)
    }

    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(items); err != nil {
        http.Error(w, fmt.Sprintf("Failed to encode items: %v", err), http.StatusInternalServerError)
    }
}

func updateItem(w http.ResponseWriter, r *http.Request, id string) {
    var item Item
    if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
        http.Error(w, fmt.Sprintf("Failed to decode item: %v", err), http.StatusBadRequest)
        return
    }

    item.ID = id
    rev, err := db.Put(context.TODO(), item.ID, item)
    if err != nil {
        http.Error(w, fmt.Sprintf("Failed to update item: %v", err), http.StatusInternalServerError)
        return
    }

    item.Rev = rev
    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(item); err != nil {
        http.Error(w, fmt.Sprintf("Failed to encode item: %v", err), http.StatusInternalServerError)
    }
}

func generateRandomID(length int) string {
    bytes := make([]byte, length)
    if _, err := rand.Read(bytes); err != nil {
        log.Fatalf("Failed to generate random ID: %v", err)
    }
    return hex.EncodeToString(bytes)
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Println("CORS Middleware triggered")
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if r.Method == "OPTIONS" {
            log.Println("Handling preflight request")
            w.WriteHeader(http.StatusOK)
            return
        }

        next(w, r)
    }
}
