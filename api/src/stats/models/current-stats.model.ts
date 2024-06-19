import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CurrentStats {
  @Field((type) => Int)
  usersCount: number;
  @Field((type) => Int)
  booksCount: number;
  @Field((type) => Int)
  reviewCount: number;
}
