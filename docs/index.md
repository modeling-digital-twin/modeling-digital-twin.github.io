# IoT Modelling for Digital Twins

## Introduction

Welcome to the IoT Modelling for Digital Twins documentation. This project focuses on creating comprehensive models for Internet of Things (IoT) systems that can be represented as digital twins in virtual environments.

## What are Digital Twins?

Digital twins are virtual representations of physical objects, processes, or systems that serve as the real-time digital counterparts of physical entities. In the IoT context, digital twins enable:

- Real-time monitoring and visualization
- Predictive analytics and simulation
- Enhanced decision-making capabilities
- Optimized performance and maintenance


## What is CAPS?

The CAPS Modeling Framework was created to support the engineering of **Situational Aware Cyber-Physical Systems (SiA-CPS)**. SiA-CPS are systems consisting of a set of IoT devices such as sensors, cameras, RFID, and other monitoring tools used to continuously observe given indoor and outdoor spaces. The data gathered during this process is then transformed into actionable insights.

SiA-CPS systems require monitoring in both time and space, meaning they consist of:

- **Software components** (drivers and code running on the sensors)
- **Hardware components** (sensors, cameras, RFID, etc.)
- **Environmental interactions** (how software and hardware components interact with their surroundings)

Designing such systems poses challenges in ensuring consistency between managing software, hardware, and environmental views. To address this, the CAPS Modeling Framework provides a **multi-view approach** based on the IEEE/ISO/IEC 42010 standard, ensuring structured and coherent system modeling.

For more information, visit: **[https://caps.disim.univaq.it/](https://caps.disim.univaq.it/)**

## What is CupCarbon

**CupCarbon** is a comprehensive simulator designed for modeling, visualizing, and analyzing **smart city** and **Internet of Things (IoT)** wireless sensor networks (WSNs). It enables users to create and simulate networks directly on geographic maps, allowing realistic placement of nodes and environmental conditions. With support for static and mobile nodes, energy consumption modeling, routing, and communication protocols, CupCarbon provides a powerful environment for testing IoT applications before physical deployment.

Researchers, educators, and developers use CupCarbon to experiment with network behaviors, evaluate communication strategies, and validate system architectures in simulated urban or rural environments. Its scripting language (**Senscript**) allows users to program node behaviors, making it highly customizable for a wide range of IoT and WSN projects.

Learn more and download CupCarbon at: **[https://cupcarbon.com/](https://cupcarbon.com/)**

## What is PDEVS?

**Parallel Discrete Event System Specification (PDEVS)** is an extension of the DEVS (Discrete Event System Specification) formalism, providing a structured approach to modeling and simulating complex discrete event systems. PDEVS enhances traditional DEVS by introducing **parallel event handling**, allowing multiple simultaneous events to be processed in a single simulation step. This improves efficiency and makes it suitable for simulating large-scale, interconnected systems.

PDEVS models a system as a set of components (atomic and coupled models) that interact through well-defined input, output, and state transition functions. Each component responds to events over simulated time, enabling hierarchical, modular, and reusable system representations.

PDEVS is widely used in fields such as **IoT, smart cities, cyber-physical systems, logistics, and distributed systems** to simulate dynamic, event-driven behaviors before implementation. It supports both theoretical analysis and practical software simulation frameworks like PyDEVS, MS4 Me, and DEVSJAVA.

To learn more, visit: **[https://en.wikipedia.org/wiki/Discrete\_Event\_System\_Specification](https://en.wikipedia.org/wiki/Discrete_Event_System_Specification)**
**[https://msdl.uantwerpen.be/documentation/PythonPDEVS/](https://msdl.uantwerpen.be/documentation/PythonPDEVS/)**

This documentation and the associated codebase are maintained by a team from IIITH. 

- **Maintainer**: Likhith Kanigolla
- **Advisor**: Dr. Karthik Vaidhyanathan