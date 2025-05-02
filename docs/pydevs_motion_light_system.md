# PyDEVS Motion Light System

This project implements a motion-activated lighting system using the Parallel DEVS (Discrete Event System Specification) formalism through PyDEVS.

## System Overview

The system simulates a smart lighting setup where motion sensors trigger lights through a routing component. It demonstrates the principles of discrete event simulation with loosely coupled components communicating through well-defined interfaces.

## File Structure and Concepts

### `model.py`

This file defines the top-level coupled DEVS model (`GeneratedModel`) that composes the entire simulation. In DEVS formalism, a coupled model contains:

- Components (atomic or coupled models)
- Input and output ports
- Coupling relationships between components

The `GeneratedModel` class instantiates the motion sensor, router, and light components, then establishes the connections between them to form the complete system topology.

### `motionsensor.py`

This file implements the `MotionSensor` atomic DEVS model that simulates a physical motion sensor. Key concepts:

- `MotionSensorState`: Maintains the state variables for the sensor component
- `MotionSensor`: Implements the DEVS atomic model with:
  - `__init__`: Sets up the sensor with its name, initial state, and ports
  - `timeAdvance`: Determines when the next internal transition will occur
  - `outputFnc`: Generates output events when motion is detected (randomly produces 0 or 1)
  - `intTransition`: Updates the component's state after an internal transition
  - `extTransition`: Handles external events (input messages from other components)

The motion sensor generates randomized detection events (0 or 1) that are sent to the router component through its output port.

### `router.py`

This file implements the `Router` atomic DEVS model that processes and routes messages between components. Key concepts:

- `RouterState`: Maintains the state variables for the router component
- `Router`: Implements DEVS functions for routing messages:
  - Routes messages from the motion sensor to the appropriate light
  - Acts as a middleware component that can implement filtering or transformation logic
  - Follows DEVS protocol with timeAdvance, outputFnc, intTransition, and extTransition functions

The router demonstrates the concept of message passing and decoupling in event-based architectures.

### `light.py`

This file implements the `Light` atomic DEVS model that represents a physical light that turns on and off based on motion sensor input. Key concepts:

- `LightState`: Maintains the state variables for the light component
- `Light`: Implements the DEVS atomic model:
  - Accepts input from the router
  - Changes state based on the motion detection value
  - Simulates the behavior of a light (on/off) based on sensor readings
  - Implements timeouts to turn off after a period of no motion

The light component shows how output devices respond to events in a discrete event system.

### `simulate.py`

This file contains the simulation execution code. Key concepts:

- Creates an instance of the `GeneratedModel`
- Configures the PyDEVS simulator with parameters:
  - Termination time (how long to run the simulation)
  - DEVS formalism type (classic DEVS)
  - Verbosity settings
- Redirects output to a log file
- Executes the simulation via `sim.simulate()`

This file demonstrates how to set up and run a discrete event simulation using the PyDEVS library.

### `style.css`

This file contains the styling for the web-based visualization of the system. It defines:

- Layout of the visualization interface
- Styling of components and connections
- Interactive elements for the visualization dashboard

The CSS supports the visualization aspect of the simulation, helping users understand the system structure and behavior.

## DEVS Conceptual Framework

The system follows the DEVS formalism which includes:

1. **State-Based Modeling**: Components maintain states that change over time
2. **Event-Driven Execution**: System advances based on events rather than fixed time steps
3. **Hierarchical Composition**: Simple models are combined to create complex systems
4. **Well-Defined Interfaces**: Components interact only through input/output ports
5. **Time Advance Function**: Each component determines when its next internal event occurs

## Simulation Flow

1. The motion sensor periodically generates motion detection events (0 or 1)
2. These events are sent to the router component
3. The router forwards the events to the appropriate light component
4. The light changes its state (on/off) based on the received values
5. The simulation continues until the specified termination time is reached