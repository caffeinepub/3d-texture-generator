# Specification

## Summary
**Goal:** Build a procedural 3D texture generator tool with a dark industrial UI, real-time 3D preview, texture map export, and a saved presets library.

**Planned changes:**
- Backend Motoko actor to store, retrieve, and delete texture presets (material name, type, parameters, timestamp)
- Texture Generator page with a material category selector (metal, wood, stone, fabric, plastic, organic, ceramic, concrete, etc.) and parameter controls (base color, roughness, metalness, bump intensity, pattern scale, color variation)
- Central 3D viewport using React Three Fiber rendering a draggable/rotatable sphere with real-time PBR material updates based on current parameters
- Procedural canvas-based generation of Albedo, Normal, Roughness, and Metalness texture maps (≥512×512 px) with PNG download buttons
- Presets Library panel to save the current configuration with a custom name, list/load/delete saved presets (persisted in backend)
- Dark industrial theme: charcoal/near-black backgrounds, amber/orange accents, technical typography, panel-based layout with prominent central 3D viewport

**User-visible outcome:** Users can configure procedural PBR textures by category and parameters, preview them live on a 3D sphere, export individual texture maps as PNG files, and save/load/delete named presets across sessions.
