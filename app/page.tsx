import Image from 'next/image';
export default function Home() {
  return (
      <div className="text-5xl text-red-300  text-center font-reenie font-semibold h-screen flex items-center " >
       <div className= "w-screen text-center"> Hi, my name is Protima!
        </div>
        <div style={{ position: 'absolute', top: '35%', right: '18%'}}>
          <img src='heart.jpg' alt="Description" width='130' height='130' />
        </div>
        <div>
          <img src='jiji.png' alt="Description" width='400' height='400' />
        </div>   
        <div style={{ position: 'absolute', top: '55%', right: '50%'}}>
          <img src='cat.gif' alt="Description" width='300' height='300' />
        </div>
      </div>
  );
}