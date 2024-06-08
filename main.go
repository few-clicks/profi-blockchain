package main

import (
	"context"
	"fmt"
	"log"

	kivik "github.com/go-kivik/kivik/v3"
	_ "github.com/go-kivik/kivik/v3/couchdb"
)

// Contract represents the contract structure
type Contract struct {
	ContractDuration              int       `json:"contract_duration"`
	MonthlyPayment                int       `json:"monthly_payment"`
	PaymentFrequency              string    `json:"payment_frequency"`
	SickLeave                     SickLeave `json:"sick_leave"`
	Vacation                      Vacation  `json:"vacation"`
	BonusPerHalfYear              int       `json:"bonus_per_half_year"`
	PenaltyForContractTermination int       `json:"penalty_for_contract_termination"`
}

// SickLeave represents sick leave information
type SickLeave struct {
	DaysPerHalfYear int `json:"days_per_half_year"`
	SickDayPrice    int `json:"sick_day_price"`
}

// Vacation represents vacation information
type Vacation struct {
	DaysPerMonth     float64 `json:"days_per_month"`
	VacationDayPrice int     `json:"vacation_day_price"`
}

func main() {
	client, err := kivik.New("couchdb", "http://localhost:5984/")
	if err != nil {
		log.Fatalf("Failed to create client: %s\n", err)
	}
	defer client.Close()

	dbName := "contracts_db"
	db := client.DB(context.Background(), dbName)
	if err := db.Err(); err != nil {
		log.Fatalf("Failed to connect to DB: %s\n", err)
	}

	// Example contract data
	contract := &Contract{
		ContractDuration: 24,
		MonthlyPayment:   75000,
		PaymentFrequency: "monthly",
		SickLeave: SickLeave{
			DaysPerHalfYear: 15,
			SickDayPrice:    3000,
		},
		Vacation: Vacation{
			DaysPerMonth:     2.5,
			VacationDayPrice: 3500,
		},
		BonusPerHalfYear:              50000,
		PenaltyForContractTermination: 50000,
	}

	docID := "contract_id_12345"
	rev, err := db.Put(context.Background(), docID, contract)
	if err != nil {
		log.Fatalf("Failed to store document: %s\n", err)
	}

	fmt.Printf("Stored contract with ID %s and revision %s\n", docID, rev)
}
