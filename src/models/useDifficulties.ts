import { useState, useEffect } from 'react';
import request from '@/utils/request';

export default function useDifficulties(maxLevel = 5) {
  const [level, setLevel] = useState(1);
  useEffect(() => {
    const promise = request('v1/student/student_level', { method: 'POST' });
    if (promise) {
      promise.then((res) => setLevel(level));
    }
  }, []);
  const unblockNextLevel = () =>
    setLevel((lv) => (lv < maxLevel ? lv + 1 : lv));
  return { level, unblockNextLevel };
}
