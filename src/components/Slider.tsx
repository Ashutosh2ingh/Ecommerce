"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface HeroSliderData {
  id: number;
  title: string;
  description: string;
  image: string;
  url: string;
  bg: string;
}

const Slider = () => {
  const [current, setCurrent] = useState(1); 
  const [slider, setSlider] = useState<HeroSliderData[]>([]);
  const transitionRef = useRef<HTMLDivElement>(null);
  const SLIDE_DURATION = 3000; 

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await fetch("http://127.0.0.1:8000/heroSlider/");
        let data = await response.json();
        setSlider([data[data.length - 1], ...data, data[0]]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [slider]);

  useEffect(() => {
    if (current === slider.length - 1) {
      setTimeout(() => {
        if (transitionRef.current) {
          transitionRef.current.style.transition = "none";
          setCurrent(1); 
        }
      }, 100);
    } else if (current === 0) {
      setTimeout(() => {
        if (transitionRef.current) {
          transitionRef.current.style.transition = "none";
          setCurrent(slider.length - 2);
        }
      }, 100);
    } else {
      if (transitionRef.current) {
        transitionRef.current.style.transition = "transform 1s ease-in-out"; 
      }
    }
  }, [current, slider]);

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden relative">
      <div
        className="w-max h-full flex transition-all ease-in-out duration-1000"
        style={{ transform: `translateX(-${current * 100}vw)` }}
        ref={transitionRef}
      >
        {slider.map((slide, index) => (
          <div
            className={`${slide.bg} w-screen h-full flex flex-col gap-16 xl:flex-row`}
            key={index}
          >
            {/* Text Container */}
            <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center">
              <h2 className="text-xl lg:text-3xl 2xl:text-5xl">
                {slide.description}
              </h2>
              <h1 className="text-5xl lg:text-6xl 2xl:text-8xl font-semibold">
                {slide.title}
              </h1>
              <Link href={slide.url}>
                <button className="rounded-md bg-black text-white py-3 px-4">
                  SHOP NOW
                </button>
              </Link>
            </div>

            {/* Image Container */}
            <div className="h-1/2 xl:w-1/2 xl:h-full relative">
              <Image
                src={slide.image}
                alt="image"
                fill
                sizes="100%"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute m-auto left-1/2 bottom-8 flex gap-4">
        {slider.slice(1, -1).map((_, index) => (
          <div
            className={`w-3 h-3 rounded-full ring-1 ring-red-600 cursor-pointer flex items-center justify-center ${
              current === index + 1 ? "scale-150" : ""
            }`}
            key={index}
            onClick={() => setCurrent(index + 1)}
          >
            {current === index + 1 && (
              <div className="w-[6px] h-[6px] bg-gray-600 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;

// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// interface HeroSliderData {
//     id: number;
//     title: string;
//     description: string;
//     image: string;
//     url: string;
//     bg: string;
// }

// const Slider = () => {

//     const [current, setCurrent] = useState(0);
//     const [slider, setSlider] = useState<HeroSliderData[]>([]);

//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 let response = await fetch('http://127.0.0.1:8000/heroSlider/');
//                 let data = await response.json();
//                 setSlider(data);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         }
//         fetchData();
//     }, []);
    
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrent((prev) => (prev === slider.length - 1 ? 0 : prev + 1));
//         },3000);
//         return () => clearInterval(interval);
//     },[slider.length]);

//     return (
//         <div className="h-[calc(100vh-80px)] overflow-hidden">
//             <div 
//                 className="w-max h-full flex transition-all ease-in-out duration-1000"
//                 style={{ transform: `translateX(-${current * 100}vw)`}}
//             >
                
//                 {
//                     slider.map(slide => {
//                         return(
//                             <div 
//                                 className={`${slide.bg} w-screen h-full flex flex-col gap-16 xl:flex-row`} 
//                                 key={slide.id}
//                             >
//                                 {/* Text Container */}
//                                 <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center">
//                                     <h2 className="text-xl lg:text-3xl 2xl:text-5xl">{slide.description}</h2>
//                                     <h1 className="text-5xl lg:text-6xl 2xl:text-8xl font-semibold">{slide.title}</h1>
//                                     <Link href={slide.url}>
//                                         <button className="rounded-md bg-black text-white py-3 px-4">SHOP NOW</button>
//                                     </Link>
//                                 </div>

//                                 {/* Image Container */}
//                                 <div className="h-1/2 xl:w-1/2 xl:h-full relative">
//                                     <Image src={slide.image} alt="image" fill sizes="100%" className="object-cover" />
//                                 </div>
//                             </div>
//                         );
//                     })
//                 }
//             </div>

//             <div className="absolute m-auto left-1/2 bottom-8 flex gap-4">
//                 {
//                     slider.map((slide, index) => {
//                         return(
//                             <div 
//                                 className={`w-3 h-3 rounded-full ring-1 ring-red-600 cursor-pointer flex items-center justify-center ${
//                                     current === index ? "scale-150" : "" 
//                                 }`} 
//                                 key={slide.id}
//                                 onClick={() => setCurrent(index)}
//                             >
//                                 {
//                                     current === index && (
//                                         <div className="w-[6px] h-[6px] bg-gray-600 rounded-full"></div>
//                                     )
//                                 }
//                             </div>
//                         );
//                     })
//                 }
//             </div>
//         </div>
//     );
// };

// export default Slider;