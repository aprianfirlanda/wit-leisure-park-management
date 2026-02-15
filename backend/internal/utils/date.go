package utils

import (
	"fmt"
	"time"
)

const DateLayout = "2006-01-02"

func ParseDate(value *string) (*time.Time, error) {
	if value == nil {
		return nil, nil
	}

	t, err := time.Parse(DateLayout, *value)
	if err != nil {
		return nil, fmt.Errorf("date must be in format YYYY-MM-DD")
	}

	return &t, nil
}
