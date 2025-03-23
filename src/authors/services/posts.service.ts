import { Injectable } from '@nestjs/common';
import { Post } from '../models/post.model';

type PostSubType = Post & { authorId: number };

@Injectable()
export class PostsService {
  private readonly posts: Array<PostSubType> = [
    { id: 1, title: 'Main post', votes: 300, authorId: 1 },
    { id: 2, title: 'Second post', votes: 200, authorId: 1 },
    { id: 3, title: 'Third post', votes: 100, authorId: 2 },
    { id: 4, title: 'Fourth post', votes: 100, authorId: 2 },
  ];

  create(post: PostSubType): PostSubType {
    post.id = this.posts.length + 1;
    this.posts.push(post);
    return post;
  }

  findAll({ authorId }: { authorId?: number }): PostSubType[] {
    if (authorId) {
      return this.posts.filter((post) => post.authorId === authorId);
    }

    return this.posts;
  }

  findOneById(id: number): PostSubType | undefined {
    return this.posts.find((post) => post.id === id);
  }
}
