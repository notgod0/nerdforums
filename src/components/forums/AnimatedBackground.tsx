import { useEffect } from "react";

export const AnimatedBackground = () => {
  useEffect(() => {
    const container = document.body;
    const numCircles = 5;

    // Remove any existing circles
    const existingCircles = document.querySelectorAll('.circle');
    existingCircles.forEach(circle => circle.remove());

    // Create new circles
    for (let i = 0; i < numCircles; i++) {
      const circle = document.createElement('div');
      circle.className = 'circle';
      
      // Random size between 200px and 500px
      const size = Math.random() * 300 + 200;
      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;
      
      // Random position
      circle.style.left = `${Math.random() * 100}%`;
      circle.style.top = `${Math.random() * 100}%`;
      
      // Random animation delay
      circle.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(circle);
    }

    // Cleanup function to remove circles when component unmounts
    return () => {
      const circles = document.querySelectorAll('.circle');
      circles.forEach(circle => circle.remove());
    };
  }, []);

  return null;
};