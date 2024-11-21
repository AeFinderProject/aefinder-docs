---
sidebar_position: 2
---

# Quick Start

## 1. Create an AeIndexer in AeFinder
   - Log in to AeFinder and create your own AeIndexer.
   - **AeFinder System Web URL**
     - MainNet: [https://www.aefinder.io](https://www.aefinder.io)
     - TestNet: [https://test.aefinder.io](https://test.aefinder.io)
   - Open the website, click on "Dashboard" in the top right corner to enter the AeIndexer management backend.
     ![login](./quick-start/img/login.png)
   - **User name and password**
     - Please contact the system administrator to obtain the username and password. Contact Email: contact@aefinder.io.
   - After logging in, click the "Create AeIndexer" button on the top right corner to create an AeIndexer.
     ![MyDashboardCreateApp](./quick-start/img/MyDashboardCreateApp.png)
   - In the panel that appears on the right, enter the name of the AeIndexer.
     - **Note:** The AeIndexer name can only consist of letters, numbers, and spaces, and the total length must not exceed 20 characters.

     ![CreateApp01](./quick-start/img/CreateApp01.png)
   - After successful creation, the corresponding AppId that was synchronously created will be displayed. This AppId is important for future references and integrations.

     ![CreateApp02](./quick-start/img/CreateApp02.png)
   - You can proceed to add other detailed information about the AeIndexer.
   - Alternatively, you can choose not to add any additional information and simply save. This completes the creation of the AeIndexer.
   
     ![MyDashboardHelloWorld](./quick-start/img/MyDashboardHelloWorld.png)
   - Click on the card to enter the AeIndexer details page for more operations.

## 2. Develop AeIndexer

### Install the Local Development Environment

- **Environment Requirement**: Currently, AeIndexer only supports development using the C# language.
- **Required Installation**: You will need to install the .NET 8.0 SDK locally. Visit the [official .NET download page](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) to get the SDK.

### Create and Download the AeIndexer Template

- Go to the details page of the AeIndexer you created.
- Fill in the project name for the AeIndexer you want to develop according to the specifications, and then click to download.
  ![DownloadProjectTemplate](./quick-start/img/DownloadProjectTemplate.png)

### Set up the Development Project

- **Extract Project Files**:
  - Once the download is complete, you will have a zip file. Unzip it to proceed.
  - After unzipping, you will find the `.sln` project file for C# development.
- **Project Development**:
  - Open the `.sln` file with your IDE to start developing your AeIndexer.

### Development Tips

- After creating an AeIndexer through AeFinder, you can download your AeIndexer development project.
- **IDE Recommendation**: Complete the development using the IDE you are familiar with. For more detailed instructions on how to develop an AeIndexer, please refer to the development section of the documentation or online resources.

## 3. Deploy AeIndexer

### Steps to Deploy Your AeIndexer

1. **Initiate Deployment**
   - Once your AeIndexer development is complete, log in to the AeFinder system.
   - Navigate to the AeIndexer details page.
   - Click the "Deploy" button located in the top left corner to begin the deployment process.
     ![DeployApp01](./quick-start/img/DeployApp01.png)

2. **Set Up Subscription Information**
   - Fill in the subscription information in JSON format. This includes specifying details such as `ChainId`, `StartBlockNumber`, `Transactions`, and `LogEvents`.
   - Upload the `.dll` file of your AeIndexer.
     ![DeployApp02](./quick-start/img/DeployApp02.png)

### Example of Subscription Information JSON

```json
{
    "SubscriptionItems": [
        {
            "ChainId": "AELF",
            "StartBlockNumber": 225599981,
            "OnlyConfirmed": false,
            "Transactions": [
                {
                    "To": "JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE",
                    "MethodNames": ["Create", "Approve"]
                }
            ],
            "LogEvents": [
                {
                    "ContractAddress": "JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE",
                    "EventNames": ["Transferred"]
                },
                {
                    "ContractAddress": "2LUmicHyH4RXrMjG4beDwuDsiWJESyLkgkwPdGTR8kahRzq5XS",
                    "EventNames": ["SetSomeInput"]
                }
            ]
        },
        {
            "ChainId": "tDVV",
            "StartBlockNumber": 124424409,
            "OnlyConfirmed": false,
            "Transactions": [
                {
                    "To": "7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX",
                    "MethodNames": ["Create"]
                }
            ],
            "LogEvents": [
                {
                    "ContractAddress": "7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX",
                    "EventNames": ["Transferred"]
                }
            ]
        }
    ]
}
```

- After confirming that the subscription information and the .dll file are correct, click the "Deploy" button to complete the deployment.

## 4. Test AeIndexer

### Testing and Troubleshooting

1. **Access the Playground**
   - After a successful deployment, navigate back to the AeIndexer details page.
   - Locate the Playground panel where you can enter GraphQL query statements to interact with the AeIndexer interface.
     ![DashboardPlayground](./quick-start/img/DashboardPlayground.png)

2. **Check Subscription Version**
   - In the Playground panel, use the dropdown menu located at the top right corner to view the current subscription version number of the AeIndexer.
     ![DashboardVersion](./quick-start/img/DashboardVersion.png)

3. **View Logs**
   - Click on the "Logs" tab below the Playground panel to switch to the log panel.
   - Here, you can monitor the logs of your AeIndexer processing blocks and check for any abnormalities.
     ![DashboardLogs](./quick-start/img/DashboardLogs.png)

### Tips for Effective Testing

- **Query Correctly**: Ensure your GraphQL queries are well-formed to avoid errors and to properly test the functionalities of your AeIndexer.
- **Monitor Logs**: Regularly check the logs for any unusual activities or errors that could indicate issues with the AeIndexer's performance or behavior.

### Notes:

- These tools are designed to help you effectively test and refine your application before it goes live.

## 5. Query Data

### Accessing Your AeIndexer Data

To query data from your AeIndexer, you will use specific URLs provided on your AeIndexer's page. These URLs are tailored based on the network environment (MainNet or TestNet) and optionally, the specific version of your AeIndexer.

### Standard URLs for Querying Data

- **GraphQL URL for TestNet Environment**:
  - `https://test-indexer-api.aefinder.io/api/app/graphql/{AppID}`
  - **Example**: `https://test-indexer-api.aefinder.io/api/app/graphql/hello_world` where `hello_world` is the AppID.

- **GraphQL URL for MainNet**:
  - `https://indexer-api.aefinder.io/api/app/graphql/{AppID}`

### Requesting a Specific Version

If your needs require data from a specific version of your AeIndexer, modify the URL by appending the version ID. Here's how you can structure this URL:

- **URL for Specific Version on TestNet**:
  - `https://test-indexer-api.aefinder.io/api/app/graphql/hello_world/6a7665d7cf1d42a6a1c2354959f6a83a`
  - In this URL:
    - `hello_world` is the AppID.
    - `6a7665d7cf1d42a6a1c2354959f6a83a` represents a specific version of the AeIndexer.

### Tips for Effective Data Querying

- **Check the URL**: Make sure the URL is correctly formatted with your specific AppID and, if necessary, the version ID.
- **Environment Selection**: Choose the appropriate URL depending on whether you are operating in a test or production environment.

### Note:

- Replace `{AppID}` with your actual AppID when using the URLs provided. This ensures you are querying the correct data source.