'use client';

import Image from 'next/image';
import React from 'react';
import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk';

const naranhiLatLng = {
  lat: 37.509577696886176,
  lng: 126.96351262787043,
};

const KakaoMap = () => {
  return (
    <Map
      center={{ lat: naranhiLatLng.lat, lng: naranhiLatLng.lng }}
      style={{ width: '100%', height: '100%' }}
      level={1}
    >
      <CustomOverlayMap
        position={{ lat: naranhiLatLng.lat, lng: naranhiLatLng.lng }}
      >
        <div
          className="rounded-lg bg-white p-4 shadow-lg"
          data-aos="fade-up"
          data-aos-delay="1000"
        >
          <div className="relative h-7 w-64">
            <Image
              src={'/imgs/naranhi-logo-color.png'}
              fill
              alt="naranhi-logo"
            />
          </div>
        </div>
      </CustomOverlayMap>
    </Map>
  );
};

export default KakaoMap;
