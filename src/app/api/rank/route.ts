import { connectToDB } from "@/libs/connectToDb";
import Business from "@/models/Business";
import { NextResponse } from "next/server";

const apiUrl = process.env.DISCOURSE_API_URL;

const authHeaders = new Headers();

authHeaders.append("api-key", process.env.DISCOURSE_API_KEY!);
authHeaders.append("Accept", "application/json");

const getUserById = async (id: number) => {
  const response = await fetch(`${apiUrl}/admin/users/${id}.json`, {
    method: "GET",
    headers: authHeaders,
    next: { revalidate: 60 },
  });

  const data = await response.json();
  // console.log("Post Count: ", data);
  return {
    name: data.username,
    postCount: data.post_count,
    topicCount: data.topic_count,
    level: data.trust_level,
  };
};

const searchPosts = async (username: string) => {
  try {
    const response = await fetch(
      `${apiUrl}/user_actions.json?offset=0&username=${username}&filter=5`,
      {
        next: { revalidate: 60 },
        // cache: "no-store",
      }
    );
    const data = await response.json();
    // console.log(
    //   "\n---------------------------posts data--------------------------\n",
    //   data
    // );
    return data.user_actions;
  } catch (error) {
    return null;
  }
};

const searchTopics = async (username: string) => {
  try {
    const response = await fetch(
      `${apiUrl}/user_actions.json?offset=0&username=${username}&filter=4`,
      {
        next: { revalidate: 60 },
        // cache: "no-store",
      }
    );
    const data = await response.json();
    // console.log(
    //   "\n--------------------------- topics --------------------------\n",
    //   data
    // );

    const topicIds = data.user_actions.map((d: any) => {
      return d.topic_id;
    });

    const postIds = [];
    for (const id of topicIds) {
      const res = await fetch(`${apiUrl}/t/${id}/posts.json`);
      const data = await res.json();

      postIds.push({ post_id: data.post_stream.posts[0].id });
    }

    return postIds;
  } catch (error) {
    return [];
  }
};

const getUserWhoLiked = async (postId: number) => {
  // console.log(postId);
  try {
    const response = await fetch(
      `${apiUrl}/post_action_users?id=${postId}&post_action_type_id=2`,
      {
        method: "GET",
        headers: authHeaders,
        next: { revalidate: 60 },
      }
    );
    const data = await response.json();
    // console.log(
    //   "\n---------------------------likes data--------------------------\n",
    //   data
    // );
    return data.post_action_users;
  } catch (error) {
    return null;
  }
};

export async function GET(req: Request) {
  try {
    await connectToDB();
    const businesses = await Business.find().select("discourseId");

    for (const business of businesses) {
      const data = await getUserById(business.discourseId);
      // const data = await getUserById(348);

      // console.log(data, "user data from id ");

      let validPosts = 0;
      let validLikes = 0;

      if (data && (data.postCount || data.topicCount)) {
        let allPosts: any[] = [];

        // console.log(data.topicCount, data.postCount);

        if (data.postCount > 0) {
          const posts = await searchPosts(data.name);
          allPosts = [...posts];
        }
        if (data.topicCount > 0) {
          const topics = await searchTopics(data.name);
          allPosts = [...allPosts, ...topics];
        }

        // console.log(allPosts);

        if (allPosts && allPosts.length) {
          for (const post of allPosts) {
            validPosts += 1;
            const liked = await getUserWhoLiked(post.post_id);
            if (liked && liked.length) {
              for (const user of liked) {
                if (user && user.id) {
                  const userData = await getUserById(user.id);
                  validLikes +=
                    userData.level === 2 ? 1 : userData.level === 3 ? 2 : 0;
                }
              }
            }
          }
        }
      }

      const updatedRank = validLikes + validPosts;

      await Business.findByIdAndUpdate(business._id, { rating: updatedRank });
    }

    //? Fetch all documents, sort by rating, and update rank
    await Business.find({
      abnVerified: true,
    })
      .select("rating rank")
      .sort({ rating: -1 })
      .exec()
      .then((businesses) => {
        businesses.forEach((business, index) => {
          business.rank = index + 1;
          business.save();
        });
      })
      .catch((error) => {
        console.error("Error updating ranking:", error);
      });

    return NextResponse.json(
      {
        success: true,
        message: "Ranked successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error Occurred",
      },
      { status: 400 }
    );
  }
}
