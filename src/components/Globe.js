import React, {Component} from 'react';
import WorldWind from '@nasaworldwind/worldwind';
import PropTypes from 'prop-types';
import { observable } from "mobx";

import { WorldWindFixes } from '../api/globe/WorldWindFixes'
import './Globe.css';

export default class Globe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            isDropArmed: false
        };
        // The WorldWindow
        this.wwd = null;
        
        // Layer managment support
        this.nextLayerId = 1;
        this.categoryTimestamps = new Map();
        
        // Projection support
        this.roundGlobe = null;
        this.flatGlobe = null;
        
        // Click/Drop support
        this.dropCallback =  null;
    }
    
    static propTypes = {
        id: PropTypes.string.isRequired, // element id
        projection: PropTypes.string,
        onUpdate: PropTypes.func
    }
    
    static projectionNames = [
        "3D",
        "Equirectangular",
        "Mercator",
        "North Polar",
        "South Polar",
        "North UPS",
        "South UPS",
        "North Gnomonic",
        "South Gnomonic"
    ];
     
    changeProjection(projectionName) {
        if (projectionName === "3D") {
            if (!this.roundGlobe) {
                this.roundGlobe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
            }
            if (this.wwd.globe !== this.roundGlobe) {
                this.wwd.globe = this.roundGlobe;
            }
        } else {
            if (!this.flatGlobe) {
                this.flatGlobe = new WorldWind.Globe2D();
            }
            if (projectionName === "Equirectangular") {
                this.flatGlobe.projection = new WorldWind.ProjectionEquirectangular();
            } else if (projectionName === "Mercator") {
                this.flatGlobe.projection = new WorldWind.ProjectionMercator();
            } else if (projectionName === "North Polar") {
                this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("North");
            } else if (projectionName === "South Polar") {
                this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("South");
            } else if (projectionName === "North UPS") {
                this.flatGlobe.projection = new WorldWind.ProjectionUPS("North");
            } else if (projectionName === "South UPS") {
                this.flatGlobe.projection = new WorldWind.ProjectionUPS("South");
            } else if (projectionName === "North Gnomonic") {
                this.flatGlobe.projection = new WorldWind.ProjectionGnomonic("North");
            } else if (projectionName === "South Gnomonic") {
                this.flatGlobe.projection = new WorldWind.ProjectionGnomonic("South");
            }
            if (this.wwd.globe !== this.flatGlobe) {
                this.wwd.globe = this.flatGlobe;
            }
        }
    }
    
    /**
     * Returns a new array of layers within the given category.
     * @param {String} category E.g., "base", "overlay" or "setting".
     * @returns {Array}
     */
    getLayers(category) {
        return this.wwd.layers.filter(layer => layer.category === category);
    }
    
    /**
     * Returns the layer with the given id.
     * @param {Number} id Unique layer id assigned by addLayer
     * @returns {WorldWind.Layer|null}
     */
    getLayer(id) {
        let layers = this.wwd.layers.filter(layer => layer.uniqueId === id);
        return layers.length > 0 ? layers[0] : null;
    }
    
    /**
     * Returns the first layer with the given name.
     * @param {String} name
     * @returns {WorldWind.Layer|null}
     */
    findLayerByName(name) {
        let layers = this.wwd.layers.filter(layer => layer.displayName === name);
        return layers.length > 0 ? layers[0] : null;
    }
    /**
     * Add a layer to the globe and applies options object properties to the 
     * the layer.
     * @param {WorldWind.Layer} layer
     * @param {Object|null} options E.g., {category: "base", enabled: true}
     * @returns {Number} Unique layer id in this globe
     */
    addLayer(layer, options) {
        // Copy all properties defined on the options object to the layer
        if (options) {
            for (let prop in options) {
                if (!options.hasOwnProperty(prop)) {
                    continue; // skip inherited props
                }
                layer[prop] = options[prop];
            }
        }
        // Assign a category property for layer management 
        if (typeof layer.category === 'undefined') {
            layer.category = 'overlay'; // default category
        }

        // Assign a unique layer ID to ease layer management 
        layer.uniqueId = this.nextLayerId++;
        // Add the layer to the globe
        this.wwd.addLayer(layer);
        // Signal a change in the category
        this.updateCategoryTimestamp(layer.category);
        
        this.publishUpdate(layer.category);
        return layer.uniqueId;
    }
    
        /**
     * Toggles the enabled state of the given layer and updates the layer
     * catetory timestamp. Applies a rule to the 'base' layers the ensures
     * at max Ïonly one base layer is enabled.
     * @param {WorldWind.Layer} layer
     */
    toggleLayer(layer) {
        // Apply rule: only [0..1] "base" layers can be enabled at a time
        if (layer.category === 'base') {
            this.wwd.layers.forEach(function (item) {
                if (item.category === 'base' && item !== layer) {
                    item.enabled = false;
                }
            });
        }
        // Toggle the selected layer's visibility
        layer.enabled = !layer.enabled;
        // Trigger a redraw so the globe shows the new layer state ASAP
        this.wwd.redraw();
        // Signal a change in the category
        this.updateCategoryTimestamp(layer.category);
        
        this.publishUpdate(layer.category);
    }

    /**
     * Returns an observable containing the last update timestamp for the category.
     * @param {String} category
     * @returns {Observable} 
     */
    getCategoryTimestamp(category) {
        if (!this.categoryTimestamps.has(category)) {
            this.categoryTimestamps.set(category, observable.box(Date.now()));
        }
        return this.categoryTimestamps.get(category);
    }

    /**
     * Updates the timestamp for the given category.
     * @param {String} category
     */
    updateCategoryTimestamp(category) {
        let timestamp = this.getCategoryTimestamp(category);
        timestamp.set(Date.now());  // observable
    }

    publishUpdate(category) {
        if (this.props.onUpdate) {
            // Lift-up the layer category state to the parent via a props function
            let key = category + "Layers";
            let state = {layers: this.getLayers(category), lastUpdated: Date.now()};
            let data = {};
            data[key] = state;
            // Update the parent's state via the props function callback
            this.props.onUpdate(data);
        }
    }
    
    goTo(latitude, longitude) {
        const location = new WorldWind.Location(latitude, longitude);
        this.wwd.goTo(location);
    }

    activateClickDrop(dropCallback) {
        this.dropCallback = dropCallback;
        this.setState({isDropArmed: true});
    }

   /**
    * Handles a click on the WorldWindow. If a "drop" action callback has been
    * defined, it invokes the function with the picked location.
    * @param {Object} event
    */
    handleGlobeClick(event) {
        if (!this.state.isDropArmed) {
            return;
        }
        // Get the clicked window coords
        let type = event.type, x, y;
        switch (type) {
            case 'click':
                x = event.clientX;
                y = event.clientY;
                break;
            case 'touchend':
                if (!event.changedTouches[0]) {
                    return;
                }
                x = event.changedTouches[0].clientX;
                y = event.changedTouches[0].clientY;
                break;
            default:
        }
        if (this.dropCallback) {
            // Get all the picked items 
            const pickList = this.wwd.pickTerrain(this.wwd.canvasCoordinates(x, y));
            // Terrain should be one of the items if the globe was clicked
            const terrain = pickList.terrainObject();
            if (terrain) {
                this.dropCallback(terrain.position);
            }
        }
        this.setState({isDropArmed: false});
        event.stopImmediatePropagation();
    };
    

    componentDidMount() {
        // Create the WorldWindow using the ID of the canvas
        this.wwd = new WorldWind.WorldWindow(this.props.id);
        WorldWindFixes.applyWorldWindowFixes(this.wwd); 
        // Projection support
        this.roundGlobe = this.wwd.globe;
        if (this.props.projection) {
            this.changeProjection(this.props.projection);
        }    
        // Click/pick handler suppoert
        this.wwd.addEventListener('click', (e)=>this.handleGlobeClick(e));
        this.wwd.addEventListener('touchend', (e)=>this.handleGlobeClick(e));  
        // Add background layer
        this.addLayer(new WorldWind.BMNGOneImageLayer(),
            {
                category: "background",
                enabled: true,
                minActiveAltitude: 0    // override the default value of 3e6;
            });        
        this.setState({isValid: true});
    }

    render() {
        // JSX code to create canvas for the WorldWindow
        let classes = "globe-canvas d-block " + (this.state.isDropArmed ? "cursor-crosshair" : "cursor-default");
        return(
            <canvas id={this.props.id} className={classes}>
                Your browser does not support HTML5 Canvas.
            </canvas>
        );
    }
};

