'use client'
import SomeComponent from '@/components/somecomponent';
import { useEffect, useState } from 'react'

interface TrackingDetail {
  kind: string;
  level: number;
  manName: string;
  manPic: string;
  telno: string;
  telno2: string;
  time: number;
  timeString: string;
  where: string;
  code: string | null;
  remark: string | null;
}

interface packageData {

  adUrl: string,
  complete: boolean,
  invoiceNo: string,
  itemImage: string,
  itemName: string,
  level: number,
  receiverAddr: string,
  receiverName: string,
  recipient: string,
  result: string,
  senderName: string,
  trackingDetails: TrackingDetail[],
  orderNumber: string | null,
  estimate: string | null,
  productInfo: string | null,
  zipCode: string | null,
  lastDetail: TrackingDetail,
  lastStateDetail: TrackingDetail,
  firstDetail: TrackingDetail,
  completeYN: string,

}


interface Company {
  International : string;
  Code: string;
  Name: string;
}

interface ThemeColor {
  [key: string]: {
    back: string;
    hover: string;
    active: string;
    text: string;
    outline: string;
    odd: string;
    after:string;
    border:string;
    rgb:string;

  }
}
//2중객체에서는 index값 못씀

interface ButtonType {
  name: string;
  theme: string;
}


export default function Home() {
  // const [test, setTest] = useState<string>();
  const [carriers,setCarriers] = useState<Company[]>([]);
  const [allCarriers, setAllCarriers] = useState<Company[]>([]);
  const [theme, setTheme] = useState<string>('default');
  const [tcode, setTcode] = useState<string>('04');
  const [tinvoice, setTinvoice] = useState<string>('');
  // 운송장번호
  const [tname, setTname] = useState<string>('CJ대한통운');
  const [isBtn, setIsBtn] = useState<number | null>(null);
  const [infoTracking, setInfoTracking]= useState<packageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [menuActive, setMenuActive] = useState<boolean>(false);

  const themeColor :ThemeColor = {
    "default":{
      "back": "bg-indigo-500",
      "hover": "hover:bg-indigo-300",
      "active": "bg-indigo-400",
      "text": "text-indigo-500",
      "outline": "outline-indigo-300",
      "odd" :"odd:bg-indigo-50",
      "after" :"after:bg-indigo-500",
      "border" :"boder-indigo-300",
      "rgb" :"#6366f1",
    },
    "orange":{
      "back": "bg-orange-500",
      "hover": "hover:bg-orange-300",
      "active": "bg-orange-400",
      "text": "text-orange-500",
      "outline": "outline-orange-300",
      "odd" :"odd:bg-orange-50",
      "after" :"after:bg-orange-500",
      "border" :"boder-orange-300",
      "rgb" :"#f97316",
    },
    "pink":{
      "back": "bg-pink-500",
      "hover": "hover:bg-pink-300",
      "active": "bg-pink-400",
      "text": "text-pink-500",
      "outline": "outline-pink-300",
      "odd" :"odd:bg-pink-50",
      "after" :"after:bg-pink-500",
      "border" :"boder-pink-300",
      "rgb" :"#d1859c",
    },   
  }


  const buttons :ButtonType[] =[
    {name:"검정", theme:"default"},
    {name:"핑크", theme:"orange"},
    {name:"오렌지", theme:"pink"},
  ]

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // useEffect(() => {
  //   localStorage.setItem('themeKey', theme);
  // }, [theme]);

  useEffect(()=>{
    const fetchData = async () =>{
      setIsLoading(isLoading)
      try{
        const res = await fetch(`https://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.NEXT_PUBLIC_API_MAIN_KEY}`);
        const data = await res.json();
        console.log(data);
        setCarriers(data.Company);
        setAllCarriers(data.Company);
        setIsLoading(false);
      }catch(error){
        console.log(error);
      }
    }
    fetchData();
  },[])

  const selectCode = (BtnNumber: number, code: string, name: string) =>{
    setIsBtn(BtnNumber)
    setTcode(code)
    setTname(name)
     const isInterational = BtnNumber === 2 ? "true" : "false" 
     const filterCarriers = allCarriers.filter(e => e.International === isInterational)
     setCarriers(filterCarriers)
  }

  const blindNumber = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const value = e.target.value;
    const result = carriers.find((e) => e.Code === tcode)
    if(result){
      if(result.International === "false"){
        e.target.value = e.target.value.replace(/[^0-9]/g,'')

      }
    }
    setTinvoice(value);
  }

  const PostSubmit = async () =>{
    // setIsLoading(true);
    setIsShow(false);
    setError("");
    const url = new URL(`https://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice} &t_key=${process.env.NEXT_PUBLIC_API_MAIN_KEY}`)

    // const url = new URL("http://info.sweettracker.co.kr/api/v1/trackingInfo");
    // url.searchParams.append ("t_code", tcode);
    // url.searchParams.append ("t_invoice", tinvoice);
    // url.searchParams.append ("key",`${process.env.REACT_APP_API_KEY}`);

  
    try {
      const res = await fetch(`https://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice} &t_key=${process.env.NEXT_PUBLIC_API_MAIN_KEY}`)
      const data = await res.json();
      setIsLoading(false);
      if(data.firstDetail === null){
        setError("데이터없음");
        setIsLoading(false);
      }
      if (data.code === '104' || data.code === '105'){
        setError(data.msg);
      }else{

        setInfoTracking(data);
        setIsShow(true);
      }
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  const PostListName :string[] = ["상품인수", "상품이동중", "배송지도착", "배송출발", "배송완료"];

  const toggleMenu = () =>{
    setMenuActive(!menuActive)
  }

  return (

    <>    

    <div className={`${themeColor[theme].back} p-5 text-black text-sm md:text-xl xl:text-2xl flex xl:justify-between  justify-center`}>
            <h3 className="font-extrabold md:text-center">국내/외 택배조회 시스템</h3>
              <div className="fixed right-5 top-5 transition-all duration-500 z-50 cursor-pointer xl:hidden" onClick={() =>{toggleMenu();}}>
                <div style={{transform: menuActive ? `rotate(-45deg) translateY(15px)` : ""}} className={`${menuActive ? ` transform translate-y-[10px] w-[30px] h-[5px] bg-black dark:bg-[#ebf4f1] rounded m-[5px] transition-all duration-1000` : "w-[30px] h-[5px] bg-black dark:bg-[#ebf4f1] rounded m-[5px] transition-all duration-500"}`}></div>
                <div style={{transform: menuActive ? `rotate()` : ""}} className={`${menuActive ? "opacity-0 -translate-x-8 w-[30px] h-[5px] bg-black dark:bg-[#ebf4f1] rounded m-[5px] transition-all duration-500" : "w-[30px] h-[5px] bg-black dark:bg-[#ebf4f1] rounded m-[5px] transition-all duration-500"}`}></div>
                <div style={{transform: menuActive ? `rotate(45deg) translateY(-15px)` : ""}} className={`${menuActive ? `-translate-y-[30px] w-[30px] h-[5px] bg-black dark:bg-[#ebf4f1] rounded m-[5px] transition-all duration-500 `: "w-[30px] h-[5px] bg-black dark:bg-[#ebf4f1] rounded m-[5px] transition-all duration-500"}`} ></div>
                </div>
                <div style={{transform: menuActive ? `` : ""}} className={`${menuActive ?  `w-72 h-full fixed right-0 top-0 ${themeColor[theme].back} p-12 box-border transition-all duration-100 xl:hidden` : `w-72 h-full fixed  top-0 ${themeColor[theme].back} p-12 box-border transition-all duration-100 xl:hidden -right-72 z-[1000]`}`}>
                  <div className=''>
                    <span className='text-3xl font-semibold'>테마</span>
                    {
                      buttons.map((e,i)=>{
                        return(
                          <>
                            <button key={i} className= {`mx-1 md:mx-2 xl:mx-3 block py-3 ${themeColor[theme].back}`} onClick={()=>{
                              setTheme(e.theme);
                              localStorage.setItem("theme", e.theme);
                              }}>{e.name}</button>
                          </>
                        )
                      })
                    }
                  </div>
              </div>
          <div className='hidden xl:block'>
            <span>테마 :</span>
            {
              buttons.map((e,i)=>{
                return(
                  <>
                    <button key={i} className= {`mx-1 md:mx-2 xl:mx-3 ${themeColor[theme].back}`} onClick={()=>{
                      setTheme(e.theme);
                      localStorage.setItem("theme", e.theme);
                      }}>{e.name}</button>
                  </>
                )
              })
            }
          </div>
          
    </div>
      <div className="w-4/5 md:w-3/5 xl:w-4/12 mx-auto my-40 flex rounded items-center pt-2 flex-wrap">
        <div className="border-b basis-full py-2 px-2 flex justify-center items-center text-sm">
          <span className="basis-[30%] text-center mr-5">국내 / 국외 선택</span>
          <button className={`text-sm border p-1 px-5 rounded hover:text-white mr-4 ${isBtn === 1? 'text-white' : 'text-black'} ${themeColor[theme].hover} ${isBtn === 1 ? themeColor[theme].active : ''}`  }  onClick={()=>{selectCode(1, '04', 'CJ대한통운')}}>국내</button>
          <button className={`text-sm border p-1 px-5 rounded hover:text-white ${isBtn === 2? 'text-white' : 'text-black'} ${themeColor[theme].hover} ${isBtn === 2 ? themeColor[theme].active : ''}`} onClick={()=>{selectCode(2, '12' , 'EMS')}}>국외</button>
        </div>
        <div className="basis-full py-4 border-b">        
        <select className="w-full border p-2 rounded-md" value={tcode} onChange={(e)=>{
        const result = carriers.find(el => el.Code === e.target.value);
        if(result){
          setTcode(result.Code)
          setTname(result.Name)
        }
      }}>

          {
            carriers.map((e,i)=>{
              return(
                <>
                <option key={i} value={e.Code}>{e.Name}</option>
                </>
              )
            })
          }

        </select>
        </div>
        <div className="basis-full py-4 border-b text-center">
          <input type="text" onInput={blindNumber} 
          placeholder="운송장 번호를 입력해주세요." className={`w-full border px-5 py-2 rounded-md ${themeColor[theme].outline}`} />
        </div>
        <div className="basis-full border-b py-4 text-center">
          <button className={`${themeColor[theme].back} text-white px-5 py-2 rounded-md w-full`} onClick={PostSubmit}>조회하기</button>
        </div>
        {
          error &&
          <div className="basis-full text-center py-4 border-b">
          <span className={`${themeColor[theme].text}`}>{error}</span>
        </div>
        }
      </div>
      {
        isShow && 
        <>
        <div className="w-full">
          <div className={`${themeColor[theme].back} text-white flex justify-center py-10 px-5 flex-wrap items-center text-center`}>
            <span className="text-xl basis-[45%] font-bold mr-5 mb-5">운송장 번호</span>
            <h3 className="text-2xl basis-[45%] font-bold mb-5">{tinvoice}</h3>
            <span className="text-xl basis-[45%] font-bold mr-5 mb-5">택배사</span>
            <h3 className="text-2xl basis-[45%] font-bold mb-5">{tname}</h3>
          </div>
        </div>
        <div className="bg-white my-5 flex justify-around py-5 relative before:absolute before:bg-[#e2e5e8] before:h-0.5 before:box-border before:top-[45%] before:left-[10%] before:w-4/5 before:z-0">
          {
            Array(5).fill('').map((_,i)=>{
              const resultLevel = infoTracking && i + 1 === (infoTracking?.level - 1);
              return(
                <div key={i} className={`${infoTracking && resultLevel ? themeColor[theme].after: 'after:bg-gray-200'} relative z-10 after:absolute after:w-[60px] after:h-[60px] after:rounded-full after:left-0 after:top-0`}>
                  <img className="relative z-10" src={`images/ic_sky_delivery_step${i+1}_on.png`} alt={PostListName[i]} />
                  <p className={`text-center text-xs mt-1 ${infoTracking && resultLevel ? `${themeColor[theme].text} font-bold` : ""}`}>{PostListName[i]}</p>
                  {/* 레벨의 글자 > 테마의 색상 +글자진하게 */}
                </div>
              )
            })
          }
        </div>
        <div className="bg-white py-5">
          {
            infoTracking && infoTracking.trackingDetails.slice().reverse().map((e,i)=>{
              return(
                <div key={i} className={`pl-20 py-5 relative group ${themeColor[theme].odd}`}>
                  <div className={`${i === 0 ? `${themeColor[theme].back} ${themeColor[theme].border}` : 'bg-white'} relative border-2 rounded-full w-2 h-2 -left-[30px] top-10 z-30`}></div>
                  <p>{e.where} | {e.kind}</p>
                  <p>{e.telno}</p>
                  <p>{e.timeString}</p>
                  <div className={`group-last:h-0 h-full absolute w-0.5 left-[53px] top-[60px] z-20 ${themeColor[theme].back}`}></div>
                </div>
              )
            })
          }
        </div>
        </>
      }  
    </>
  )
}
