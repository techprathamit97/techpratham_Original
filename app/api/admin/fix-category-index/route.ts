import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await connectMongo();

        const db = mongoose.connection.db;
        if (!db) {
            return NextResponse.json({ message: 'Database connection not established' }, { status: 500 });
        }
        const collection = db.collection('categories');

        // Get current indexes
        const indexes = await collection.indexes();
       

        // Find and drop problematic unique indexes
        const indexesToDrop = ['position_1', 'name_1', 'description_1'];
        for (const index of indexes) {
            if (index.name && indexesToDrop.includes(index.name)) {
               
                try {
                    await collection.dropIndex(index.name);
                    
                } catch (dropError: any) {
                    console.log(`Could not drop `);
                }
            }
        }

        // Create the correct compound index (unique per parent)
        try {
            await collection.createIndex(
                { parentId: 1, position: 1 },
                { unique: true, name: 'parentId_position' }
            );
          
        } catch (idxError: any) {
            console.log('Compound index may already exist:');
        }

        // Make slug unique
        try {
            await collection.createIndex(
                { slug: 1 },
                { unique: true, name: 'slug_1' }
            );
            
        } catch (idxError: any) {
            console.log('Slug index may already exist:');
        }

        // Get updated indexes
        const updatedIndexes = await collection.indexes();

        return NextResponse.json({
            success: true,
            message: 'Index fixed successfully',
            indexes: updatedIndexes.map(idx => ({
                name: idx.name,
                unique: idx.unique,
                key: idx.key
            }))
        }, { status: 200 });

    } catch (error: any) {
        console.error('Fix index error:', error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}