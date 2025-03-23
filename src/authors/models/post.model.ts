import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field((_) => Int)
  id: number;

  @Field()
  title: string;

  @Field((_) => Int, { nullable: true })
  votes?: number;
}
