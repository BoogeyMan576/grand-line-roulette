import { useEffect } from 'react';

export const useBattleScale = () => {
  useEffect(() => {
    const handleResize = () => {
      const grid = document.querySelector('.battle-arena-grid') as HTMLElement;
      if (!grid) return;

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // 1. DESKTOP (> 1450px)
      if (screenW > 1450) {
        grid.style.transform = ''; 
        grid.style.width = ''; 
        grid.style.height = ''; 
        return;
      }

      // 2. DEFINE BASE DIMENSIONS
      let baseWidth;
      
      // Fold 5
      if (screenW >= 750 && screenW <= 890) {
         baseWidth = 1600;
      } 
      // 🔥 PHONES: SPLIT LOGIC 🔥
      else if (screenW <= 950) {
         // iPhone 14 Pro Max / 15 Plus (Wider than 415px)
         if (screenW > 415) {
             baseWidth = 1350; // WIDER CANVAS = MORE GAP (Prevents Overlap)
         } 
         // iPhone 12 / 13 / 14 Pro (Narrower)
         else {
             baseWidth = 1100; // TIGHTER CANVAS = BIGGER ELEMENTS (Prevents Tiny Look)
         }
         
         grid.style.width = `${baseWidth}px`;
      } 
      // Tablets
      else {
         baseWidth = 1300;
      }

      const baseHeight = 700;

      // 3. CALCULATE SCALE
      const scaleX = screenW / baseWidth;
      const scaleY = screenH / baseHeight;
      
      const scale = Math.min(scaleX, scaleY) * 0.95;

      // 4. APPLY TRANSFORM
      grid.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Run immediately
    handleResize(); 
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
};