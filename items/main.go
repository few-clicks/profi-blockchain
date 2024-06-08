package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-kivik/couchdb/v3"
	"github.com/go-kivik/kivik/v3"
	"github.com/gorilla/mux"
)

// Item represents the document structure
type Item struct {
	ID          string  `json:"_id,omitempty"`
	Rev         string  `json:"_rev,omitempty"`
	WalletID    string  `json:"walletId"`
	Title       string  `json:"title"`
	Role        string  `json:"role"` // Allowed values: "employee", "company"
	Salary      float64 `json:"salary"`
	Vacation    int     `json:"vacation"`  // Days
	SickLeave   int     `json:"sickLeave"` // Days
	Bonus       float64 `json:"bonus"`
	Penalty     float64 `json:"penalty"`     // New field for penalty
	Description string  `json:"description"` // New field for description
}

var client *kivik.Client
var db *kivik.DB
var dbName = "itemsdb"

// Initialize CouchDB client and database
func initDb() {
	var err error
	client, err = kivik.New("couch", "http://admin:password@localhost:5984/") // Update with correct URL and credentials
	if err != nil {
		log.Fatalf("Failed to connect to CouchDB: %s", err)
	}

	// Create or open the database
	err = client.CreateDB(context.TODO(), dbName)
	if err != nil && err.Error() != "Precondition Failed: The database could not be created, the file already exists." {
		log.Fatalf("Failed to create database: %s", err)
	}

	db = client.DB(context.TODO(), dbName)
	if err != nil {
		log.Fatalf("Failed to open database: %s", err)
	}
}

// Create a new item
func createItem(w http.ResponseWriter, r *http.Request) {
	var item Item
	err := json.NewDecoder(r.Body).Decode(&item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	docID, rev, err := db.CreateDoc(context.TODO(), item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	item.ID = docID
	item.Rev = rev
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// Get an item by ID
func getItem(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	var item Item
	err := db.Get(context.TODO(), params["id"]).ScanDoc(&item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// Delete an item
func deleteItem(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	item := Item{ID: params["id"]}
	err := db.Get(context.TODO(), item.ID).ScanDoc(&item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = db.Delete(context.TODO(), item.ID, item.Rev)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Get all items
func getAllItems(w http.ResponseWriter, r *http.Request) {
	rows, err := db.AllDocs(context.TODO(), kivik.Options{"include_docs": true})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var items []Item
	for rows.Next() {
		var item Item
		if err := rows.ScanDoc(&item); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items.append(items, item)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

// Main function to setup routes
func main() {
	initDb()

	router := mux.NewRouter()

	router.HandleFunc("/", getAllItems).Methods("GET")
	router.HandleFunc("/", createItem).Methods("POST")
	router.HandleFunc("/{id}", getItem).Methods("GET")
	router.HandleFunc("/{id}", deleteItem).Methods("DELETE")

	fmt.Println("Server is running on port 8000")
	log.Fatal(http.ListenAndServe(":8000", router))
}
