package models

type Event struct {
    Slug        string `json:"slug"`
    Title       string `json:"title"`
    Description string `json:"description"`
    Created     string `json:"created"`
    StartTime   string `json:"startTime"`
    EndTime     string `json:"endTime"`
	IsDeleted    bool `json:"isDeleted"`
}

var Events []Event