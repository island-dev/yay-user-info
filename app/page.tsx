"use client";
import React, { useState } from 'react';
import useSWR from 'swr';
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar"

const fetcher = (url: string) => fetch(url).then(res => res.json());

const UserProfile = () => {

  const [userId, setUserId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { data, error } = useSWR(userId ? `https://yax-api.vercel.app/yay/users/detail?userId=${userId}` : null, fetcher);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Check if the input is a valid integer
    if (/^\d+$/.test(userId)) {
      setErrorMessage('');
      // Trigger SWR to fetch data with the new userId
      // No need to call mutate as changing the key (userId) will automatically re-fetch
    } else {
      setErrorMessage('正しいユーザーIDを入力してください');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };

  return (
    <div className=''>
      <form className="max-w-sm mx-auto mt-56" onSubmit={handleSubmit}>
        <h1 className='flex justify-center text-2xl font-extrabold mb-14'>Yay!ユーザー情報開示ツールβ版</h1>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">対象ユーザーのID</label>
          <input value={userId} onChange={handleChange} type="userId" id="userId" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-800 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-800" placeholder="6427604" required />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
          {userId && <Button type="submit" className="flex justify-center text-white hover:bg-gray-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</Button>}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle className='text-2xl'>
            <Avatar>
              <AvatarImage className='flex justify-center border border-gray rounded-full' src={(data && data.profileIcon)} alt="@usericon" />
            </Avatar>
            {errorMessage && <p>{errorMessage}</p>}
            {!errorMessage && (!errorMessage && data && data.nickname) ? <div className='text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-700'>{data.nickname}のアカウント情報</div> : ((!errorMessage && data && data.message === 'user not found') ? "ユーザーが見つかりませんでした" : "処理中...")}
              </AlertDialogTitle>
              <AlertDialogDescription className='text-lg text-slate-600'>
              {(data && data.biography && typeof data.biography === 'string' && data.biography.trim().length > 0) ? `自己紹介文 : ${data.biography}` : ""} <br />
              {(data && data.countryCode && typeof data.countryCode === 'string' && data.countryCode.trim().length > 0) ? `国 : ${data.countryCode}` : "国 : 不明"} <br />
              {(data && data.prefecture && typeof data.prefecture === 'string' && data.prefecture.trim().length > 0) ? `都道府県 : ${data.prefecture}` : "都道府県 : 不明"} <br />
              {(data && data.followersCount && typeof data.followersCount === 'number') ? `フォロワー : ${data.followersCount}` : "フォロワー : 不明"} <br />
              {(data && data.followingsCount && typeof data.followingsCount === 'number') ? `フォローしている数 : ${data.followingsCount}` : "フォローしている数 : 不明"} <br />
              {(data && data.vip !== undefined) ? `VIP : ${data.vip ? 'Yes' : 'No'}` : "VIP : 不明"} <br />
              {(data && data.hideVip !== undefined) ? `VIPを隠す : ${data.hideVip ? 'Yes' : 'No'}` : "VIPを隠す : 不明"} <br />
              {(data && data.dangerousUser !== undefined) ? `危険なユーザー : ${data.dangerousUser ? 'Yes' : 'No'}` : "危険なユーザー : 不明"} <br />
              {(data && data.isOnline !== undefined) ? `オンライン : ${data.isOnline ? 'Yes' : 'No'}` : "オンライン : 不明"} <br />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>{((data && data.message === 'user not found') ? "Cancel" : "Continue")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
      {error && <div>Failed to load user data</div>}
    </div>
  );
};

export default UserProfile;
