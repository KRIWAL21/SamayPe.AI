import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';

export async function PUT(req: Request) {
  try {
    const { id, email, name, avatar, archetype, cognitiveWindow, whatsappNumber } = await req.json();

    if (!id && !email) {
      return NextResponse.json({ error: 'User identifier required' }, { status: 400 });
    }

    await connectDB();

    const query = id ? { id } : { email };
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (archetype !== undefined) updateData.archetype = archetype;
    if (cognitiveWindow !== undefined) updateData.cognitiveWindow = cognitiveWindow;
    if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber;

    const updatedUser = await User.findOneAndUpdate(query, updateData, { new: true });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Update Profile API Error:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}
