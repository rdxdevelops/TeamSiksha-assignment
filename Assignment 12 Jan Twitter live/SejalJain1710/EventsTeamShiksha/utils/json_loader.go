package utils

import (
	"encoding/json"
	"io"
	"os"

	"eventsteamshiksha/models"
)

func LoadEvents() {
	file, _ := os.Open("data.json")
	defer file.Close()
	byteValue, _ := io.ReadAll(file)
	json.Unmarshal(byteValue, &models.Events)
}