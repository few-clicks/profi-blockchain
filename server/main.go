package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-kivik/couchdb/v3" // The CouchDB driver
	"github.com/go-kivik/kivik/v3"
	"github.com/joho/godotenv"
)

var client *kivik.Client

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// Get CouchDB URL from environment variables
	couchDBURL := os.Getenv("COUCHDB_URL")
	if couchDBURL == "" {
		log.Fatalf("COUCHDB_URL is not set in .env file")
	}

	// Connect to CouchDB
	client, err = kivik.New("couch", couchDBURL)
	if err != nil {
		log.Fatalf("Failed to connect to CouchDB: %s", err)
	}

	http.HandleFunc("/create", createDocument)
	http.HandleFunc("/read", readDocument)

	log.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func createDocument(w http.ResponseWriter, r *http.Request) {
	db := client.DB(r.Context(), "testdb")
	if db.Err() != nil {
		http.Error(w, db.Err().Error(), http.StatusInternalServerError)
		return
	}

	doc := map[string]interface{}{
		"type": "example",
		"name": "Golang CouchDB",
	}

	rev, err := db.Put(r.Context(), "example_doc", doc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "Document created with revision: %s", rev)
}

func readDocument(w http.ResponseWriter, r *http.Request) {
	db := client.DB(r.Context(), "testdb")
	if db.Err() != nil {
		http.Error(w, db.Err().Error(), http.StatusInternalServerError)
		return
	}

	docID := "example_doc"
	row := db.Get(r.Context(), docID)
	if row.Err != nil {
		http.Error(w, row.Err.Error(), http.StatusInternalServerError)
		return
	}

	var doc map[string]interface{}
	if err := row.ScanDoc(&doc); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(doc)
}
