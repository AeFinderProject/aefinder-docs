---
sidebar_position: 3
---

# Developing
## Creating an AeFinder App

By using AeFinder to download development templates, you can quickly build an AeFinder App project. For how to download development templates, please read the [Quick Start](quick-start.md)  section.

### Project Structure

The project structure created by the development template is as follows:
```
.
├── MyApp.sln
├── src
│ └── MyApp
│ ├── Contracts
│ │ ├── MyContract.c.cs
│ │ └── MyContract.g.cs
│ ├── Entities
│ │ └── MyEntity.cs
│ ├── GraphQL
│ │ ├── AppSchema.cs
│ │ ├── GetMyEntityInput.cs
│ │ ├── MyEntityDto.cs
│ │ └── Query.cs
│ ├── MyApp.csproj
│ ├── MyAppModule.cs
│ ├── MyAppProfile.cs
│ └── Processors
│ └── MyLogEventProcessor.cs
└── test
└── MyApp.Tests
├── AssemblyInfo.cs
├── Contracts
├── MyApp.Tests.csproj
├── MyAppTestBase.cs
├── MyAppTestModule.cs
└── Processors
└── MyLogEventProcessorTests.cs
```
#### Solution Contents

The solution contains two directories, namely:
- \`src\`: AeFinder App project
- \`test\`: AeFinder App unit test project

#### AeFinder App Project Structure

In the AeFinder App project, we present the following structure:
- **Contracts**: Used to place contract project stiles.
- **Entities**: Used to place the AeFinder App entity.
- **GraphQL**: Used to place GraphQL schema, query, etc.
- **Processors**: Used to place specific LogEvent, Transaction, and Block Processor.

The following chapters will provide a detailed introduction to each module.

### Get the Contract File

In the AeFinder App project, if you need to perform tasks such as processing specified LogEvent or querying data from the chain, you will need to use contract log events and interface definitions. This involves incorporating the appropriate contract file into your project.

#### Steps to Integrate Contract Files

1. **Compile the Contract Project**:
   Start by compiling the corresponding contract project. This action generates the contract file in the `Protobuf/Generated` folder within the contract project.

2. **Locate the Contract Files**:
   After compilation, you can find the contract files, typically named as follows:
   - `MyContract.c.cs`
   - `MyContract.g.cs`
   - `ACS1.c.cs`
   - `ACS1.g.cs`
   - ... (include any additional contract files as necessary)

3. **Copy the Contract Files**:
   Copy the required contract files from the `Protobuf/Generated` folder to the `Contracts` folder of your AeFinder App project.

   Here's an example of the command you might use in a terminal if you are using a Unix-like system:
   ```bash
   cp path/to/Protobuf/Generated/*.cs path/to/MyApp/src/MyApp/Contracts/
   ```


### Defining Entities

Create an `Entities` directory under the project to store business data entity classes.

#### Overview

Depending on different business needs, a data table is generally required to store the data after processing the block data. At this time, you need to define a data entity class to build this data table. The system uses MongoDB and ElasticSearch databases to store data by default.

#### Example Entity Definition

Here is an example of how a data entity class might be defined:

```csharp
public class ContractRegistration : AeFinderEntity, IAeFinderEntity
{
    [Keyword]
    public string CodeHash { get; set; }

    [Text(Index = false)]
    public string Code { get; set; }

    [Keyword]
    public string ProposedContractInputHash { get; set; }

    public int ContractCategory { get; set; }

    public ContractType ContractType { get; set; }
}
```

In the above example, `ContractRegistration` is the name of the data entity class. Each data entity class must inherit the `IAeFinderEntity` interface and the `AeFinderEntity` abstract class.

##### [Keyword] Attribute 
This is an index attribute in the NEST library, which acts on the ElasticSearch data index and is used to identify whether a string type field needs to be segmented. The `[Keyword]` tag means no segmentation, otherwise, the default segmentation will affect the filtering results:
- All string-type fields should be marked as `[Keyword]`, unless the field content is particularly large or the field needs to be fuzzy-matched.
- All non-string type fields cannot be marked as `[Keyword]`.

##### [Text(Index = false)] Attribute
For string fields with particularly large content, such as more than 256 characters, they should be marked as `[Text(Index = false)]`, not `[Keyword]`.

### Defining Processors

Create a `Processor` directory under the project, where you can define various types of block data processors. There are three types of data processors: `BlockProcessor`, `TransactionProcessor`, and `LogEventProcessor`.

#### LogEventProcessor

This is the most commonly used processor, which is used to process the log event data specified in the block.

The method of use is to define a Processor class and inherit the `AeFinder.Sdk.Processor.LogEventProcessorBase<TEvent>` abstract class, where `TEvent` is the event class defined in the contract, as follows:

```csharp
public class MyLogEventProcessor : LogEventProcessorBase<MyLogEvent>
{
    public override string GetContractAddress(string chainId)
    {
        return chainId switch
        {
            "AELF" => "MainChainContractAddress",
            "tDVV" => "SideChainContractAddress",
            _ => string.Empty
        };
    }

    public override async Task ProcessAsync(MyLogEvent logEvent, LogEventContext context)
    {
        var address = logEvent.Address.ToBase58();
        var id = context.ChainId + "-" + address + "-" + logEvent.Symbol;
        var entity = await GetEntityAsync<MyEntity>(id);
        if (entity == null)
        {
            entity = new MyEntity
            {
                Id = id,
                Address = address,
                Symbol = logEvent.Symbol,
                Amount = logLogEvent.Amount
            };
        }
        else
        {
            entity.Amount += logEvent.Amount;
        }
        await SaveEntityAsync(entity);
    }
}
```
Next, we will analyze the various components of the processor and their detailed usage one by one.

##### GetContractAddress Method

```csharp
public override string GetContractAddress(string chainId)
{
    return chainId switch
    {
        "AELF" => "MainChainContractAddress",
        "tDVV" => "SideChainContractAddress",
        _ => string.Empty
    };
}
```

The `GetContractAddress(string chainId)` method overloads a method in the base class to tell the system that the contract to be processed by this processor returns the corresponding contract address based on the `chainId` passed in as an input parameter.

**Note:** The contract address returned here must correspond to the environment, chain, and event, otherwise the system will not be able to push the expected event data to the processor.

##### ProcessAsync Method

The `ProcessAsync` method in the processor is primarily responsible for implementing the actual processing logic. This method takes two parameters: the log event data (`MyLogLogEvent logEvent`) and the event context (`LogEventContext context`).

```csharp
public override async Task ProcessAsync(MyLogEvent logEvent, LogEventContext context)
{
    // Processing logic goes here
}
```

The `ProcessAsync` method is mainly used to write the processor processing logic, and the input parameters are log event data and event context.

##### GetEntityAsync`<MyEntity>(id)`

This asynchronous method is mainly used to query existing business data, and the input parameter is the ID of the saved business data.

**Note:** Currently, this method can only be used in the processor to query existing business data, and other methods of query are not supported.

##### SaveEntityAsync(entity)

This method is mainly used to store processed business data in the data table, that is, to store the previously defined Entity in the underlying database of AeFinder.

**Note:** The Id must be specified when storing the Entity.

#### TransactionProcessor

The `TransactionProcessor` is used to process the transactions within a block. To implement this functionality, you need to define a class named `Processor` that inherits from the `AeFinder.Sdk.Processor.TransactionProcessorBase` abstract class. You must also overload the `ProcessAsync` method. Below is an example of how to define such a class:

```csharp
public class TransactionProcessor : Transaction and TransactionContext
{
    public override async Task ProcessAsync(Transaction transaction, TransactionContext context)
    {
        // Implement transaction processing logic here
    }
}
```
##### Transaction
The `Transaction` type data contains information for each transaction within a block. This includes all the transaction details necessary for processing and analysis.

##### TransactionContext
The `TransactionContext` type data contains context information related to each transaction. This can include additional metadata or environmental information that supports the processing of transactions.

#### BlockProcessor

The `BlockProcessor` is specifically designed to handle the processing of block information. To utilize this functionality, define a class named `Processor` that inherits from the `AeFinder.Sdk.Processor.BlockProcessorBase` abstract class. Additionally, you should implement the `ProcessAsync` method by overloading it. Here's how you can define such a class:

```csharp
public class BlockProcessor : BlockProcessorBase, ITransientDependency
{
    public override async Task ProcessAsync(Block block, BlockContext context)
    {
        // Implement block processing logic here
    }
}
```

##### Block
The `Block` type data contains block-specific information, which usually includes details such as the block number, the hash, the previous block's hash, timestamp, and transactions included in the block. This type is crucial for blockchain operations and data integrity.

##### BlockContext
The `BlockContext` type data holds context information about the block. This might include information about the network state at the time the block was processed, validations that need to be performed on the block, and any other relevant environmental or operational context.

#### Processor Registration in Application Module

For processors to be effective in an application, they must be registered within the application's module. This is typically done in the `ConfigureServices` method of the module class. Here's how you can register different types of processors in a module using an example of an ABP (ASP.NET Boilerplate vNext) module:

```csharp
public class MyAppModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Register LogEventProcessor as a singleton
        context.Services.AddSingleton<ILogEventProcessor, MyLogEventProcessor>();

        // Register TransactionProcessor as a singleton
        context.Services.AddSingleton<ITransactionProcessor, TransactionProcessor>();

        // Register BlockProcessor as a singleton
        context.Services.AddSingleton<IBlockProcessor, BlockProcessor>();
    }
}
```

### Defining a GraphQL Query Class

To implement GraphQL queries within your project, you will need to create a specific class that handles these queries. Follow the steps below to create and configure a GraphQL query class named `Query`.

#### Step 1: Create a GraphQL Directory
First, create a directory named `GraphQL` under your project root. This directory will organize all GraphQL-related classes and make them easily identifiable.

#### Step 2: Define the Query Class
Inside the `GraphQL` directory, create a new class file named `Query.cs`. This class will contain methods that represent your GraphQL queries. Here is an example of how to define a method within this class to fetch entities:

```csharp
public class Query
{
    public static async Task<List<MyEntityDto>> MyEntity(
        [FromServices] IReadOnlyRepository<MyEntity> repository,
        [FromServices] IObjectMapper objectMapper,
        GetMyEntityInput input)
    {
        // Asynchronously get the queryable object from the repository
        var queryable = await repository.GetQueryableAsync();
        
        // Filter based on ChainId
        queryable = queryable.Where(a => a.Metadata.ChainId == input.ChainId);
        
        // Optionally filter by Address if it is not null or whitespace
        if (!input.Address.IsNullOrWhiteSpace())
        {
            queryable = queryable.Where(a => a.Address == input.Address);
        }
        
        // Execute the query to get a list of entities
        var accounts = queryable.ToList();

        // Map the entity list to a DTO list using the object mapper
        return objectMapper.Map<List<MyEntity>, List<MyEntityDto>>(accounts);
    }
}
```

Here, a query interface named `MyEntity` is defined, where `GetMyEntityInput` and `MyEntityDto` are additionally defined input and output entity classes. In actual scenarios, you can define many query interfaces like this to meet business needs.

The input parameters of the sampling method also include two common service classes: `IReadOnlyRepository<MyEntity>` repository and `IObjectMapper` objectMapper. They are marked with `[FromServices]`, indicating that these two parameters are services, not input parameters in the actual interface.

The repository business data storage class can be used to query data from the business data table, using Linq syntax to query.

ObjectMapper is an object mapping tool class that can be used to map the entity data of the data table to the output entity class, especially when GraphQL has strict restrictions on the output entity type.

**Note**: In the GraphQL interface, types such as `GetMyEntityInput` and `MyEntityDto` that expose the structure to the outside and are parsed by GraphQL must be simple and pure when defining its structure, otherwise it is very easy to cause GraphQL parsing failure.

#### Creating a Schema Class for GraphQL

After defining the `Query` class, it is essential to encapsulate the query structure by creating a `Schema` class. This class will serve as the foundational schema setup for the GraphQL server. Here's how you can define such a schema class:

##### Code Definition

Define a schema class that inherits from the `AeFinder.Sdk.AppSchema` class and uses the `Query` class as its generic parameter:
```csharp
public class MyAppSchema : AppSchema<Query>
{
    public MyAppSchema(IServiceProvider serviceProvider) : base(serviceProvider)
    {
    }
}
```

#### Configure Services in MyAppModule

After you have completed the definition of the `Query` class and the `Schema` class, the next step is to register these components in the application module to ensure they take effect. Here’s how you can do this in an ABP (ASP.NET Boilerplate vNext) module:

##### Code Implementation

```csharp
public class MyAppModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Register the schema as a singleton to ensure it is available application-wide
        context.Services.AddSingleton<ISchema, BlockChainAppSchema>();
    }
}
```

### Query Data from the Chain

Sometimes when processing block data, the processor needs to query the contract on the blockchain node to obtain the most accurate real-time data. In this case, the AeFinder SDK provides the `IBlockChainService` interface to facilitate developers to call the contract to query the chain data. The usage is as follows:

```csharp
public class ContractDeployedProcessor : LogEventProcessorBase<ContractDeployed>
{
    private readonly IBlockChainService _blockChainService;

    public ContractDeployedProcessor(IBlockChainService blockChainService)
    {
        _blockChainService = blockChainService;
    }

    public override async Task ProcessAsync(ContractDeployed logEvent, LogEventContext context)
    {
        var smartContractRegistration = await _blockChainService.ViewContractAsync<SmartContractRegistration>(
            context.ChainId, GetContractAddress(context.ChainId),
            "GetSmartContractRegistrationByCodeHash", logEvent.CodeHash);
    }
}
```

In the above example, the `await _blockBlockChainService.ViewContractAsync<T>(string chainId, string contractAddress, string contractMethodName, IMessage parameter)` method can be used to successfully call the contract and return a result of the corresponding type.

### Logging 
AeFinder provides a log interface. Developers can record necessary logs in the AeFinder App and view log information according to the log level through the AeFinder App developer background.

#### Using the log interface
In BlockProcessor, TransactionProcessor, and LogEventProcessor, you can directly use the base class Logger to record logs.

```csharp
Logger.LogDebug("Processing LogEvent.");
```

In other services, you can also use the log interface by injecting IAeFinderLogger.

```csharp
private readonly IAeFinderLogger Logger;
```

#### Supported Log Levels
Currently, AeFinder supports the following log levels:
- Information
- Debug
- Warning
- Error

#### Log Limitation
AeFinder has set appropriate limits on log size and call times. For details, please refer to AeFinder App operation limits.

### Entity Mapping
AeFinder integrates the AutoMapper library and supports object mapping using AutoMapper. You can do this by adding your own mapping logic to the Profile.

```csharp
public class MyAppProfile : Profile
{
    public MyAppProfile()
    {
        CreateMap<MyEntity, MyEntityDto>();
    }
}
```

### AeFinder App Limitations 
To ensure the normal operation of the AeFinder service, necessary restrictions will be imposed on the AeFinder App during deployment and operation.

#### AeFinder App Deployment Limitations
Currently, each AeFinder App is only allowed to define up to 100 entities. If the limit is exceeded, it will not be deployed normally.

#### AeFinder App Operation Limitations
During the operation of the AeFinder App, the resource usage will be restricted by block as follows:

| Limitation              | Data size        | Requests/Block |
|-------------------------|------------------|----------------|
| Entity save/delete      | 100,000 Bytes    | 100            |
| Logging                 | 100,000 characters | 100          |
| Query data from the chain | -              | 20             |

## Unit Testing
AeFinder provides an app testing package: `AeFinder.App.TestBase`, which enables developers to write unit tests before formal deployment to verify the logic of their own app and find potential problems before deployment.

### Install Dependencies
To ensure the unit tests run properly, you need to install the following dependencies:

**Elasticsearch 7.15.0**
1. **Download and unzip Elasticsearch**
   - Download URL: [Elasticsearch 7.15.0](https://www.elastic.co/cn/downloads/past-releases/elasticsearch-7-15-0)
2. **Start Elasticsearch**
   - Run `bin/elasticsearch` (or `bin\elasticsearch.bat` on Windows) to start Elasticsearch.

### Create a Unit Test Project and Reference the AeFinder.App.TestBase Package
- Install the latest `AeFinder.App.TestBase` package in the unit test project:
  ```shell
  dotnet add package AeFinder.App.TestBase
  ```

**Note:** If you are using the AeFinder development template, the template has already built a unit test project for you using the Xunit test framework and referenced the latest AeFinder.App.TestBase package.

### Begin Writing Unit Tests

Register your Processor in the TestModule so that it can be used in the test class.

```csharp
public class MyAppTestModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Register entity options
        Configure<AeFinderAppEntityOptions>(options => 
        {
            options.AddTypes<AppTemplateModule>();
        });
        
        // Register your custom Processor as a Singleton
        context.Services.AddSingleton<MyLogEventProcessor>();
    }
}
```

Inject the processor and services required to be tested into the test class.

```csharp
public class MyLogEventProcessorTests
{
    private readonly MyLogEventProcessor _myLogEventProcessor;
    private readonly IReadOnlyRepository<MyEntity> _repository;
    private readonly IObjectMapper _objectMapper;

    public MyLogEventProcessorTests()
    {
        // Getting the required service instances from the dependency injection container
        _myLogHeaderProcessor = GetRequiredService<MyLogEventProcessor>();
        _repository = GetRequiredService<IReadOnlyRepository<MyEntity>>();
        _objectMapper = GetRequiredService<IObjectMapper>();
    }
}
```

Use the simulated LogEvent in the test method to generate a LogEventContext, process the LogEvent, and verify the result.

```csharp
[Fact]
public async Task Test()
{
    // Create a simulated log event with necessary properties initialized.
    var logEvent = new MyLogEvent
    {
        // Initialize properties here if necessary
    };

    // Generate a context for the log event which can be processed.
    var logEventContext = GenerateLogEventContext(logEvent);

    // Process the simulated log event.
    await _myLogEventProcessor.ProcessAsync(logEventContext);
    
    // Query the repository for entities affected by the log event processing.
    var entities = await Query.MyEntity(_repository, _objectMapper, new GetMyEntityInput
    {
        ChainId = ChainId // Ensure ChainId or other relevant properties are correctly set.
    });

    // Assert the expected outcome, e.g., the correct number of entities are modified/created.
    entities.Count.ShouldBe(1); // Using Shouldly for assertions
}
```

In the above test method, we use the GenerateLogEventContext method of AeFinderAppTestBase to generate the LogEventContext required by the LogEventProcessor. Similarly, for TransactionProcessor and BlockProcessor, AeFinderAppTest about also provides GenerateTransactionContext and GenerateBlockContext methods to generate the corresponding Context information.

### Avoid Parallel Execution of Unit Tests

Since unit tests require access to Elasticsearch data storage, it's important to avoid using the same data concurrently, which could lead to inconsistent test results. To disable parallel execution in the unit test project using Xunit, you can configure the test assembly as follows:

```csharp
using Xunit;

[assembly: CollectionBehavior(DisableTestParallelization = true)]
```

### Configuring a Custom Elasticsearch Service

In `AeFinder.App.TestBase`, the default Elasticsearch service is set to use the IP and port `127.0.0.1:9200`. This setup is sufficient if you are using the default Elasticsearch installation on your machine; you can directly run the unit tests without needing any configuration changes.

#### Customizing Elasticsearch Configuration

If you require a different IP or port for the Elasticsearch service, you can configure this in your unit test project. Here is an example of how to set this up in an ABP module:

```csharp
using Abp.Modules;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;

public class MyAppTestModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AeFinderAppEntityOptions>(options => { options.AddTypes<AppTemplateModule>(); });
        
        // Add your Processors.
        context.Services.AddSingleton<MyLogEventProcessor>();
        
        // Customize Elasticsearch configurations
        context.Services.Configure<ElasticsearchOptions>(options =>
        {
            options.Uris = new List<string>()
            {
                "http://your_custom_ip:your_custom_port"
            };
        });
    }
}
```