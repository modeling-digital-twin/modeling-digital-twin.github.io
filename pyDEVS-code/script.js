// Auto-generated visualization script
document.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('system-diagram');
    const startBtn = document.getElementById('start-sim-btn');
    const stopBtn = document.getElementById('stop-sim-btn');
    const restartBtn = document.getElementById('restart-sim-btn');
    const timeDisplay = document.getElementById('sim-time');
    const logContainer = document.getElementById('sim-log');
    const svgNS = "http://www.w3.org/2000/svg";

    let modelData = null;
    let simulationData = [];
    let componentElements = {};
    let connectionElements = {};
    let componentPositions = {};
    let currentEventTime = 0;
    let isSimulationRunning = false;

    const COMPONENT_WIDTH = 150;
    const COMPONENT_HEIGHT = 70;
    const H_SPACING = 100;
    const V_SPACING = 50;
    const SIMULATION_SPEED_FACTOR = 5;
    const ANIMATION_DURATION = 500;

    // Pre-defined component colors from the generated template
    const componentColors = {
        'c1': '#2980b9',
        'c2': '#8e44ad',
        'c3': '#27ae60',
    };

    // Load data
    async function loadData() {
        try {
            logEvent("Loading simulation data...");
            
            // Load model.json
            const modelResponse = await fetch('model.json');
            if (!modelResponse.ok) throw new Error(`Failed to load model.json: ${modelResponse.status}`);
            modelData = await modelResponse.json();
            logEvent("Model data loaded successfully");
            
            // Load CSV data
            const csvResponse = await fetch('parsed_output.csv');
            if (!csvResponse.ok) throw new Error(`Failed to load CSV: ${csvResponse.status}`);
            const csvText = await csvResponse.text();
            
            // Parse CSV
            const csvData = parseCSV(csvText);
            processSimulationData(csvData);
        } catch (error) {
            console.error("Error loading data:", error);
            logEvent(`Error: ${error.message}`);
        }
    }

    // Parse CSV keeping values as strings
    function parseCSV(text) {
        const lines = text.split('\n').filter(line => line.trim());
        let startLine = 0;
        
        if (lines[0].includes('// filepath:')) {
            startLine = 1;
        }
        
        const headers = lines[startLine].split(',').map(h => h.trim());
        const result = [];
        
        for (let i = startLine + 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            
            headers.forEach((header, j) => {
                if (j < values.length) {
                    row[header] = values[j];
                }
            });
            
            result.push(row);
        }
        
        return result;
    }

    // Process simulation data
    function processSimulationData(data) {
        simulationData = data.filter(row => 
            row && row.time && row.from && row.to && row.value !== undefined
        );
        
        logEvent(`Loaded ${simulationData.length} simulation events`);
        
        if (simulationData.length === 0) {
            logEvent("Warning: No valid simulation data found");
        } else {
            startBtn.disabled = false;
            restartBtn.disabled = false;
            renderSystem();
        }
    }

    // Render the system diagram
    function renderSystem() {
        if (!modelData || !svg) return;
        
        svg.innerHTML = '';
        createArrowheadMarker();
        positionComponents();
        
        modelData.components.forEach(component => {
            createComponentElement(component);
        });
        
        modelData.connections.forEach(connection => {
            createConnectionElement(connection);
        });
        
        setSVGViewBox();
        generateLegend();
    }

    // Create arrowhead marker
    function createArrowheadMarker() {
        const defs = document.createElementNS(svgNS, 'defs');
        const marker = document.createElementNS(svgNS, 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '8');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');
        
        const polygon = document.createElementNS(svgNS, 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('fill', '#555');
        marker.appendChild(polygon);
        defs.appendChild(marker);
        svg.appendChild(defs);
    }

    // Generate legend with component names
    function generateLegend() {
        const legendContainer = document.querySelector('.legend');
        if (!legendContainer) return;
        
        legendContainer.innerHTML = '';
        
        modelData.components.forEach(comp => {
            const item = document.createElement('li');
            
            const colorBox = document.createElement('span');
            colorBox.className = `legend-color legend-item-${comp.id}`;
            colorBox.style.backgroundColor = componentColors[comp.id] || '#7f8c8d';
            
            const label = document.createElement('span');
            label.textContent = comp.name || comp.id;
            
            item.appendChild(colorBox);
            item.appendChild(label);
            legendContainer.appendChild(item);
        });
    }

    // Position components based on flow analysis
    function positionComponents() {
        const graph = buildConnectionGraph();
        const levels = analyzeComponentFlow(graph);
        
        Object.entries(levels).forEach(([id, level], index) => {
            const component = modelData.components.find(c => c.id === id);
            if (!component) return;
            
            const x = 100 + level * (COMPONENT_WIDTH + H_SPACING);
            const y = 50 + index * (COMPONENT_HEIGHT + V_SPACING);
            
            componentPositions[id] = {
                x, y,
                width: COMPONENT_WIDTH,
                height: COMPONENT_HEIGHT
            };
        });
        
        optimizePositions(graph);
    }

    // Build connection graph
    function buildConnectionGraph() {
        const graph = {};
        
        modelData.components.forEach(comp => {
            graph[comp.id] = { incoming: [], outgoing: [] };
        });
        
        modelData.connections.forEach(conn => {
            const [fromComp, fromPort] = conn.from.split('.');
            const [toComp, toPort] = conn.to.split('.');
            
            if (graph[fromComp]) graph[fromComp].outgoing.push(toComp);
            if (graph[toComp]) graph[toComp].incoming.push(fromComp);
        });
        
        return graph;
    }

    // Analyze component flow to determine levels
    function analyzeComponentFlow(graph) {
        const levels = {};
        const visited = new Set();
        
        // Find starting components (no incoming connections)
        const startNodes = Object.keys(graph).filter(id => graph[id].incoming.length === 0);
        
        // If we found clear starting points, use breadth-first traversal
        if (startNodes.length > 0) {
            let currentLevel = startNodes;
            let level = 0;
            
            while (currentLevel.length > 0) {
                currentLevel.forEach(id => {
                    levels[id] = level;
                    visited.add(id);
                });
                
                // Find next level components
                const nextLevel = [];
                currentLevel.forEach(id => {
                    graph[id].outgoing.forEach(target => {
                        if (!visited.has(target) && 
                            graph[target].incoming.every(src => visited.has(src))) {
                            nextLevel.push(target);
                        }
                    });
                });
                
                currentLevel = nextLevel;
                level++;
            }
        }
        
        // Assign remaining components based on role or position in the list
        modelData.components.forEach((comp, index) => {
            if (!visited.has(comp.id)) {
                // Assign level based on component type/role if possible
                const role = comp.role ? comp.role.toLowerCase() : '';
                
                if (role === 'sensor' || role === 'input') {
                    levels[comp.id] = 0;
                } else if (role === 'controller' || role === 'processor') {
                    levels[comp.id] = 1;
                } else if (role === 'actuator' || role === 'output') {
                    levels[comp.id] = 2;
                } else {
                    // Default placement
                    levels[comp.id] = index % 3; // Simple distribution for remaining components
                }
            }
        });
        
        return levels;
    }

    // Optimize component positions for better visualization
    function optimizePositions(graph) {
        // TODO: Add position optimization logic if needed
    }

    // Create component element
    function createComponentElement(component) {
        const pos = componentPositions[component.id];
        if (!pos) return;
        
        const group = document.createElementNS(svgNS, 'g');
        group.setAttribute('class', `component component-${component.id}`);
        group.setAttribute('data-id', component.id);
        
        // Create rectangle
        const rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('x', pos.x);
        rect.setAttribute('y', pos.y);
        rect.setAttribute('width', pos.width);
        rect.setAttribute('height', pos.height);
        group.appendChild(rect);
        
        // Create component name
        const nameText = document.createElementNS(svgNS, 'text');
        nameText.setAttribute('x', pos.x + pos.width/2);
        nameText.setAttribute('y', pos.y + pos.height/2 - 15);
        nameText.textContent = component.name || component.id;
        group.appendChild(nameText);
        
        // Create component type/ID
        const typeText = document.createElementNS(svgNS, 'text');
        typeText.setAttribute('x', pos.x + pos.width/2);
        typeText.setAttribute('y', pos.y + pos.height/2 + 5);
        typeText.setAttribute('class', 'type-label');
        typeText.textContent = component.id;
        group.appendChild(typeText);
        
        // Create data value display
        const dataText = document.createElementNS(svgNS, 'text');
        dataText.setAttribute('x', pos.x + pos.width/2);
        dataText.setAttribute('y', pos.y + pos.height/2 + 25);
        dataText.setAttribute('class', 'data-value');
        dataText.textContent = '—';
        group.appendChild(dataText);
        
        componentElements[component.id] = group;
        svg.appendChild(group);
    }

    // Create connection element
    function createConnectionElement(connection) {
        const [fromComp, fromPort] = connection.from.split('.');
        const [toComp, toPort] = connection.to.split('.');
        
        if (!componentPositions[fromComp] || !componentPositions[toComp]) return;
        
        const fromPos = componentPositions[fromComp];
        const toPos = componentPositions[toComp];
        
        // Calculate start and end points
        const startX = fromPos.x + fromPos.width;
        const startY = fromPos.y + fromPos.height/2;
        const endX = toPos.x;
        const endY = toPos.y + toPos.height/2;
        
        // Create path with bezier curve
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('class', 'connection');
        
        const controlPointDistance = (endX - startX) / 2;
        const d = `M ${startX} ${startY} 
                   C ${startX + controlPointDistance} ${startY}, 
                     ${endX - controlPointDistance} ${endY}, 
                     ${endX} ${endY}`;
        
        path.setAttribute('d', d);
        path.setAttribute('marker-end', 'url(#arrowhead)');
        path.setAttribute('data-from', connection.from);
        path.setAttribute('data-to', connection.to);
        
        // Apply source component color
        const sourceColor = componentColors[fromComp];
        if (sourceColor) {
            path.style.stroke = sourceColor;
        }
        
        connectionElements[`${connection.from}-${connection.to}`] = path;
        svg.appendChild(path);
    }

    // Set SVG viewBox for proper scaling
    function setSVGViewBox() {
        let minX = Infinity, minY = Infinity;
        let maxX = 0, maxY = 0;
        
        Object.values(componentPositions).forEach(pos => {
            minX = Math.min(minX, pos.x);
            minY = Math.min(minY, pos.y);
            maxX = Math.max(maxX, pos.x + pos.width);
            maxY = Math.max(maxY, pos.y + pos.height);
        });
        
        const padding = 50;
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX += padding;
        maxY += padding;
        
        const width = maxX - minX;
        const height = maxY - minY;
        svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
    }

    // Start simulation
    function startSimulation() {
        if (simulationData.length === 0) {
            logEvent("No simulation data to play");
            return;
        }
        
        currentEventIndex = 0;
        currentEventTime = simulationData[0].time;
        isSimulationRunning = true;
        
        if (simulationTimeoutId) {
            clearTimeout(simulationTimeoutId);
        }
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
        restartBtn.disabled = true;
        logContainer.innerHTML = '';
        logEvent("Simulation started");
        
        processCurrentTimeEvents();
    }

    // Stop simulation
    function stopSimulation() {
        if (simulationTimeoutId) {
            clearTimeout(simulationTimeoutId);
            simulationTimeoutId = null;
        }
        
        isSimulationRunning = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        restartBtn.disabled = false;
        
        logEvent("Simulation stopped");
    }

    // Restart simulation
    function restartSimulation() {
        // First stop any running simulation
        if (isSimulationRunning) {
            stopSimulation();
        }
        
        // Reset component displays
        Object.values(componentElements).forEach(element => {
            element.classList.remove('active', 'with-data');
            const dataText = element.querySelector('.data-value');
            if (dataText) {
                dataText.textContent = '—';
            }
        });
        
        // Reset connections
        Object.values(connectionElements).forEach(element => {
            element.classList.remove('active');
        });
        
        // Reset time display
        timeDisplay.textContent = "0.00";
        
        // Start again
        startSimulation();
    }

    // Process current time events
    function processCurrentTimeEvents() {
        const currentEvents = [];
        
        while (currentEventIndex < simulationData.length && 
               simulationData[currentEventIndex].time === currentEventTime) {
            currentEvents.push(simulationData[currentEventIndex]);
            currentEventIndex++;
        }
        
        if (currentEvents.length > 0) {
            currentEvents.forEach(event => {
                logEvent(`Time ${event.time}: ${event.from} → ${event.to}: ${event.value}`);
                animateDataFlow(event.from, event.to, event.value);
            });
        }
        
        if (currentEventIndex < simulationData.length) {
            const nextEventTime = simulationData[currentEventIndex].time;
            const timeDelta = parseFloat(nextEventTime) - parseFloat(currentEventTime);
            const delay = (timeDelta * 1000) / SIMULATION_SPEED_FACTOR;
            
            timeDisplay.textContent = parseFloat(nextEventTime).toFixed(2);
            
            simulationTimeoutId = setTimeout(() => {
                currentEventTime = nextEventTime;
                processCurrentTimeEvents();
            }, delay);
        } else {
            // Simulation has completed
            isSimulationRunning = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            restartBtn.disabled = false;
            logEvent("Simulation completed");
        }
    }

    // Animate data flow between components
    function animateDataFlow(from, to, value) {
        const connKey = `${from}-${to}`;
        const connElement = connectionElements[connKey];
        
        if (connElement) {
            const fromCompId = from.split('.')[0];
            const toCompId = to.split('.')[0];
            const fromElement = componentElements[fromCompId];
            const toElement = componentElements[toCompId];
            
            // Highlight and update source component
            if (fromElement) {
                fromElement.classList.add('active', 'with-data');
                const dataText = fromElement.querySelector('.data-value');
                if (dataText) {
                    dataText.textContent = value;
                    dataText.classList.add('animate');
                    setTimeout(() => {
                        dataText.classList.remove('animate');
                    }, ANIMATION_DURATION);
                }
                
                setTimeout(() => {
                    fromElement.classList.remove('active');
                }, ANIMATION_DURATION);
            }
            
            // Highlight connection
            connElement.classList.add('active');
            setTimeout(() => {
                connElement.classList.remove('active');
            }, ANIMATION_DURATION);
            
            // Highlight target with delay
            setTimeout(() => {
                if (toElement) {
                    toElement.classList.add('active', 'with-data');
                    const dataText = toElement.querySelector('.data-value');
                    if (dataText) {
                        dataText.textContent = value;
                        dataText.classList.add('animate');
                        setTimeout(() => {
                            dataText.classList.remove('animate');
                        }, ANIMATION_DURATION);
                    }
                    
                    setTimeout(() => {
                        toElement.classList.remove('active');
                    }, ANIMATION_DURATION);
                }
            }, ANIMATION_DURATION / 2);
        }
    }

    // Log an event to the event log
    function logEvent(message) {
        const p = document.createElement('p');
        p.textContent = message;
        logContainer.appendChild(p);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // Set up event listeners
    let simulationTimeoutId = null;
    let currentEventIndex = 0;
    
    startBtn.disabled = true;
    stopBtn.disabled = true;
    restartBtn.disabled = true;
    
    startBtn.addEventListener('click', startSimulation);
    stopBtn.addEventListener('click', stopSimulation);
    restartBtn.addEventListener('click', restartSimulation);
    
    // Initialize the visualization
    logEvent("Initializing simulation viewer...");
    loadData();
});
