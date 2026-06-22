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

        // Drop ALL indexes and recreate only what we need
        console.log('Dropping all indexes...');
        await collection.dropIndexes();
        console.log('All indexes dropped');

        // Create only the indexes we need (no unique constraints)
        await collection.createIndex({ parentId: 1, position: 1 });
        await collection.createIndex({ slug: 1 });
        await collection.createIndex({ level: 1 });

        // Get updated indexes
        const updatedIndexes = await collection.indexes();
        console.log('New indexes:', updatedIndexes);

        return NextResponse.json({
            success: true,
            message: 'All indexes rebuilt',
            indexes: updatedIndexes.map(idx => ({
                name: idx.name,
                key: idx.key
            }))
        }, { status: 200 });

    } catch (error: any) {
        console.error('Fix error:', error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}