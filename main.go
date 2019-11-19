package main

import (
	"log"
	"net/http"
	"os"
)

const (
	STATIC_DIR = "./build/"
	PORT       = "8080"
)

func main() {
	fs := http.FileServer(http.Dir(STATIC_DIR))
	http.Handle("/", fs)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}

	log.Printf("Listening on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
