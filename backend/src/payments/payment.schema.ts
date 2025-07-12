import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  description: string;

  @Prop()
  userId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
