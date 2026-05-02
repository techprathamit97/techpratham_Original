import { NextApiRequest, NextApiResponse } from 'next';
import { getNavbarData } from '@/utils/navbarData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // This will return cached data if available, or fetch fresh data
    const startTime = Date.now();
    const data = await getNavbarData();
    const fetchTime = Date.now() - startTime;
    
    return res.status(200).json({ 
      success: true,
      cacheStatus: fetchTime < 100 ? 'cached' : 'fresh_fetch',
      fetchTime: `${fetchTime}ms`,
      categoriesCount: data.categories.length,
      coursesCount: data.allCourses.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking navbar cache status:', error);
    return res.status(500).json({
      success: false, 
      message: 'Failed to check cache status' 
    });
  }
}