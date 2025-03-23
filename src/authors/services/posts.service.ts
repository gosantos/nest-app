import { Injectable } from '@nestjs/common';
import { Post } from '../models/post.model';

type PostSubType = Post & { authorId: number };

const posts: PostSubType[] = Array.from({ length: 100 }, (_, i) => {
  return {
    id: i + 1,
    authorId: Math.floor(Math.random() * 3) + 1,
    title: crypto.randomUUID(),
    votes: Math.floor(Math.random() * 100),
  };
});

@Injectable()
export class PostsService {
  private readonly posts: Array<PostSubType> = posts;

  create(post: PostSubType): PostSubType {
    post.id = this.posts.length + 1;
    this.posts.push(post);
    return post;
  }

  findAll({
    authorId,
    continuationToken,
  }: {
    authorId: number;
    continuationToken?: number;
  }): PostSubType[] {
    if (continuationToken) {
      const filteredPosts = this.posts
        .filter((post) => post.authorId === authorId)
        .filter((post) => post.id > continuationToken);

      return filteredPosts;
    }

    return this.posts.filter((post) => post.authorId === authorId);
  }

  findOneById(id: number): PostSubType | undefined {
    return this.posts.find((post) => post.id === id);
  }
}
