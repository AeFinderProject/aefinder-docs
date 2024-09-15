---
sidebar_position: 4
---

# AeFinder CLI
AeFinder CLI is a command line tool used to perform some common operations of the AeFinder functionality.

## Installation
AeFinder CLI is a [dotnet global tool](https://learn.microsoft.com/en-us/dotnet/core/tools/global-tools). Install it using a command line window:
```bash
dotnet tool install -g AeFinder.Cli
```
To update an existing installation:
```bash
dotnet tool update -g AeFinder.Cli
```

## Common Options
- --appid: Required. The appid of the AeIndexer.
- --key: Required. The deploy key of the AeIndexer.
- --network: Optional (Default: MainNet). The AeFinder network (MainNet or TestNet).

## Commands
Here is a list of all available commands:
- help: Shows help on the usage of the AeFinder CLI.
- init: Initiate the AeIndexer development project.
- deploy: Deploy AeIndexer.
- update: Update AeIndexer.

### help
Show the help information of the AeFinder CLI command.
Usage:
```bash
aefinder help [option] 
```
Examples:
```bash
aefinder help
aefinder help init
```

### init
Initiate the AeIndexer development project.
Usage:
```bash
aefinder init [option] 
```
Examples:
```bash
aefinder init --name TokenAeIndexer --appid appid --key key
```
Options
- --name: Required. The project name.
- --directory: Optional. The project directory. (Default: Current directory)

### deploy
Deploy AeIndexer.
Usage:
```bash
aefinder deploy [option] 
```
Examples:
```bash
aefinder deploy -manifest manifest.json --code code.dll --appid appid --key key
```
Options
- --manifest: Required. The manifest file path of your AeIndexer.
- --code: Required. The code file path of your AeIndexer.

### update
Update the code or manifest for the deployed AeIndexer.
Usage:
```bash
aefinder update [option] 
```
Examples:
```bash
aefinder update --version version -manifest manifest.json --code code.dll --appid appid --key key
```
Options
- --version: Required. The version to update.
- --manifest: Optional. The manifest file path of your AeIndexer.
- --code: Optional. The code file path of your AeIndexer.

Note: --manifest and --code are optional, but at least one of them must be entered.