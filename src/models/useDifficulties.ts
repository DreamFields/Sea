import { useState, useEffect } from 'react';
import { post, get } from '@/utils/request';

export default function useDifficulties(maxLevel = 5) {
  const [level, setLevel] = useState(1);
  useEffect(() => {
    post<number>('v1/student/student_level').then((res) => setLevel(res));
  }, []);
  const unblockNextLevel = () =>
    setLevel((lv) => (lv < maxLevel ? lv + 1 : lv));
  return { level, unblockNextLevel };
}
