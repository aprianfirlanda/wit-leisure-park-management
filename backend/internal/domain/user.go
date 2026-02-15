package domain

type Role string

const (
	RoleManager   Role = "MANAGER"
	RoleZookeeper Role = "ZOOKEEPER"
)

type User struct {
	ID           int64
	PublicID     string
	Username     string
	PasswordHash string
	Role         Role
}
