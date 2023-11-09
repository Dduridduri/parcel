'use client'
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase 프로젝트 구성 객체
const firebaseConfig = {
  apiKey: "AIzaSyBj-ygSeu2rquiloy2Bz_Pi5JyjEz07AUg",
  authDomain: "reacttemplate-5475a.firebaseapp.com",
  projectId: "reacttemplate-5475a",
  storageBucket: "reacttemplate-5475a.appspot.com",
  messagingSenderId: "910348689500",
  appId: "1:910348689500:web:28a5818322e1966f964699"
};
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
// Firebase 앱 초기화
interface Notice {
  id: string;
  title: string;
  content: string;
  view: number;
}

export default function SomeComponent () {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNoticeData = async () => {
      const collectionRef = collection(firestore, 'notice');
      try {
        const Snapshot = await getDocs(collectionRef);
        const Data = Snapshot.docs.map(doc => ({          
          ...doc.data() as Notice // 데이터를 Notice 타입으로 타입 캐스팅
        }));
        setNotices(Data);
      } catch (error) {
        console.error("Error fetching notice data: ", error);
      }
    };
    fetchNoticeData();
  }, []);

  return (
  <>
      <div>
      <h1>Notices</h1>
        {notices.map((notice) => (
        <div key={notice.id}>
          <h2>{notice.title}</h2>
          <p>{notice.content}</p>
        </div>
      ))}
    </div>
  </>  
 
  );
};


