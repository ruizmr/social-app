package bskyweb

import "embed"

//go:embed static/* static/dist/*
var StaticFS embed.FS

//go:embed embedr-static/*
var EmbedrStaticFS embed.FS
