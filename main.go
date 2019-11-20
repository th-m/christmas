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
	http.Handle("/", middleWare(
		fs,
		checkUrl,
	))

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

func middleWare(h http.Handler, middleware ...func(http.Handler) http.Handler) http.Handler {
	for _, mw := range middleware {
		h = mw(h)
	}
	return h
}

func checkUrl(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		if r.URL.Host == "santa-nator.com" {
			http.Redirect(w, r, "www.santa-nator.com", http.StatusSeeOther)
		}
		next.ServeHTTP(w, r)
	})
}
