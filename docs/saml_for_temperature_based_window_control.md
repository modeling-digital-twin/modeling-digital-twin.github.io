# SAML for Temperature based window control

### Project Description

We will model a simple scenario: a room equipped with a temperature sensor, an actuator connected to a window, and a server for data storage. The system functions as follows:

- The sensor detects room temperature periodically.
- If the temperature exceeds a threshold, the actuator opens the window.
- If the temperature is too low, the actuator closes the window.
- The temperature data is stored on a remote server.

#### Temperature Sensor

- Starts a timer to sense temperature every 10 seconds.
- Reads temperature and sends it to the server.

#### Server

- Receives temperature data from the sensor.
- Stores it in a database.

#### Controller

- Receives temperature values.
- Decides whether to open or close the window based on thresholds (25°C and 18°C).
- Sends appropriate command (`Open` or `Close`) to the actuator.

#### Window Actuator

- Receives commands from the controller.
- Opens/closes the window accordingly.

### Steps to Create a SAML Project

#### 1. Create a New SAML Project

1. Open Eclipse and go to `File` → `New` → `Project`.
2. Select `EMF` → `Empty EMF Project`.
3. Name the project and select a location (keeping the default workspace location is recommended).
4. Click `Finish`.

#### 2. Create the SAML Model File

1. In the **Project Explorer**, expand the newly created project.
2. Right-click on the `model` folder, select `New` → `Other`.
3. Search for `CAPSModel` and select `CAPSSaml`.
4. Name the file, ensuring it ends with `.capssaml`.
5. Click `Next`, select `Software Architecture` from the model object list, and click `Finish`.

#### 3. Initialize the Diagram

1. In the **Project Explorer**, right-click on the new `.capssaml` file.
2. Select `Initialize friends diagram file`.
3. Keep the default name and location and click `Finish`.
4. The diagram editor will open with an empty canvas.

#### 4. Creating Components

1. **Temperature Sensor**:
    
    
    - From the palette, select `Component` and place it on the canvas.
    - In the **Properties** view, name it `TemperatureSensor`.
    - Inside the component, add: 
        - `Initial Mode` (to define its starting behavior).
        - `StartTimer` (to trigger periodic temperature readings).
        - `SenseTemperature` (to simulate temperature sensing).
        - `TimerFired` (to handle the timer expiration event).
        - `UnicastSendMessage` (to send the temperature data).
    - Connect these elements using `Behavior Link`.
    - Set **StartTimer Properties**: 
        - `Cyclic` → `True`
        - `Name` → `TemperatureTimer`
        - `Period` → `10000` (milliseconds, i.e., every 10 seconds)
    - Define `Primitive Data Declaration`: 
        - `Name` → `Temperature`
        - `Type` → `Real`
        - `Value` → `0.0`
2. **Server**:
    
    
    - Create a new `Component`, name it `Server`.
    - Inside, add: 
        - `Initial Mode`
        - `ReceiveMessage` (to get temperature data from the sensor)
        - `Server` (to process data)
        - `StoreData` (to save the temperature values)
    - Connect `ReceiveMessage` → `Server` → `StoreData` with `Behavior Link`.
3. **Controller**:
    
    
    - Create a `Component` named `Controller`.
    - Inside, add: 
        - `Initial Mode`
        - `ReceiveMessage` (to get temperature data from the sensor)
        - `Choice` (to implement decision-making logic)
        - Two `UnicastSendMessage` instances (to send `Open` or `Close` commands)
    - Define `Primitive Data Declaration`: 
        - `Name` → `Close`, `Type` → `Boolean`, `Value` → `False`
        - `Name` → `Open`, `Type` → `Boolean`, `Value` → `True`
    - Connect elements with `Behavior Link`: 
        - `ReceiveMessage` → `Choice`
        - `Choice` → `SendOpenMessage` (if temperature &gt; 25°C)
        - `Choice` → `SendCloseMessage` (if temperature &lt; 18°C)
4. **Window Actuator**:
    
    
    - Create a `Component` named `WindowActuator`.
    - Inside, add: 
        - `Initial Mode`
        - Two `ReceiveMessage` instances (one for `Open`, one for `Close`)
        - `Actuate` (to control the window mechanism)
    - Connect elements with `Behavior Link`: 
        - `ReceiveOpenMessage` → `Actuate` (if Open = True)
        - `ReceiveCloseMessage` → `Actuate` (if Close = False)

#### 5. Connecting Components

- Use `OutMessagePort` and `InMessagePort` to link: 
    - `TemperatureSensor` → `Server`
    - `Server` → `Controller`
    - `Controller` → `WindowActuator`