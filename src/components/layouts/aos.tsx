"use client"

import 'aos/dist/aos.css';

import AOS from 'aos';
import { useEffect } from 'react';

export const AOSInit = () => {
  useEffect(() => {
    AOS.init({
      easing: 'ease-out-quad',
      duration: 1000,
    });
  }, [])

  return null
}