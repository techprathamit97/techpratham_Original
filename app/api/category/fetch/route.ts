// import { NextResponse } from 'next/server';
// import { connectMongo } from '@/utils/mongodb';
// import { Category } from '@/models/category';

// export async function GET() {
//     try {
//         await connectMongo();
//         const categoryItem = await Category.find();

//         return NextResponse.json(categoryItem, { status: 200 });
//     } catch (error: any) {
//         console.error('Server Error:', error.message);
//         return NextResponse.json({ message: error.message }, { status: 500 });
//     }
// }




import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import { Category } from '@/models/category';

export async function GET() {
    try {
        await connectMongo();

        // ✅ SORT BY PRIORITY FIRST, THEN POSITION
        const categoryItem = await Category.find()
          .sort({ priority: -1, position: 1 }); // Priority descending, then position ascending

        return NextResponse.json(categoryItem, { status: 200 });

    } catch (error: any) {
        console.error('Server Error:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
