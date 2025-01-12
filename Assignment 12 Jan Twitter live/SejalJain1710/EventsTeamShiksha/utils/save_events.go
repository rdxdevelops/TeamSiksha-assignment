package utils

import (
	"encoding/json"
	"eventsteamshiksha/models"
	"os"
	"sync"
	"time"
)

var mu sync.Mutex

func SaveEventsPeriodically() {
	for {
		time.Sleep(5 * time.Second) // Save every 5 seconds
		mu.Lock()
		saveToFile()
		mu.Unlock()
	}
}

func saveToFile() {
	data, err := json.MarshalIndent(models.Events, "", "  ")
	if err != nil {
		return
	}

	file, err := os.Create("data.json")
	if err != nil {
		return
	}
	defer file.Close()

	_, _ = file.Write(data)
}

func SaveImmediately() {
	mu.Lock()
	defer mu.Unlock()
	saveToFile()
}
