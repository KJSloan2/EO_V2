import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import DeckLayers from './DeckLayers'; // ✅ Import without {}

createRoot(document.getElementById('deckgl-layers')!).render(
  <StrictMode>
    <DeckLayers />
  </StrictMode>,
);
