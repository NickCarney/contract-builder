'use client'

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import useQuestion5Vote from '../store/useQuestion5Vote'

const ContractBuilder5Vote = () => {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const pageCount = Number(searchParams.get('pageCount'))
  const [percent, setPercent] = useState('');

  const updatePercent = useQuestion5Vote((state) => state.updatePercent);

  const goToPage = (page: number) => {
    push(`/${page}`)
  }


  const handlePercentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPercent(event.target.value)
  }

  const handleSubmit = () => {
    updatePercent(percent)
    push('/success')
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col justify-between">
      <main className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        <div className="w-full sm:w-1/2 py-4 sm:py-10">
          <button
            onClick={() => push('/question1')}
            className="text-xs sm:text-sm text-gray-500 w-full text-left mb-2 border-none"
          >
            What type of splits contract would you like to create?
          </button>
          <button
            onClick={() => push('/question2')}
            className="text-xs sm:text-sm text-gray-500 w-full text-left mb-2 border-none"
          >
            What is the name of the song?
          </button>
          <button
            onClick={() => push('/question3')}
            className="text-xs sm:text-sm text-gray-500 w-full text-left mb-2 border-none"
          >
            How many collaborators contributed to writing the song?
          </button>

          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className="text-xs sm:text-sm text-gray-500 w-full text-left mb-2 border-none"
            >
              Contributor {i + 1}
            </button>
          ))}

          <button
            onClick={() => push('/question4')}
            className="text-xs sm:text-sm text-gray-500 w-full text-left mb-2 border-none"
          >
            Vote or designate admin?
          </button>

          <h1 className="text-lg sm:text-xl mb-4">
            What percentage of ownership of the songwriting agreement is necessary to make business decisions about the song composition?
          </h1>
          <form className="flex flex-col">
            <label className="text-xs sm:text-sm mb-2">(%)</label>
            <input
              type="text"
              className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full sm:w-1/5"
              onChange={handlePercentChange}
            />
          </form>
        </div>
        <div className="w-full sm:w-1/2 p-4 sm:p-8">
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            Your contract has yet to be completed. Continue to fill out the decision tree.
          </p>
          <h4 className="text-base sm:text-lg font-bold mb-2">2.0 Rights and Duties of the Parties</h4>
          <p className="text-xs sm:text-sm mb-4">
            None of the parties may perform legally relevant acts on the musical work without the written authorization of the 51% of the ownership, such as but not limited to the following:
          </p>
          <ol className="list-decimal pl-5 text-xs sm:text-sm">
            <li>Grant exclusive licenses for the use of the Musical Work.</li>
            <li>Edit, alter or modify the musical work, especially the contributions of the other parties, in uses or sound recordings other than the one produced under this agreement unless authorized verbally or in writing by the co-author.</li>
            <li>Exploiting the name of other parties in a manner that suggests approval or endorsement of a third-party product or service other than the musical work itself.</li>
          </ol>
        </div>
      </main>
      <footer className="mt-8 flex flex-col gap-4">
        <a
          className="text-blue-500 hover:underline hover:underline-offset-4 text-sm sm:text-base"
          href="#"
          onClick={() => push('/moreInfoVoting')}
        >
          Still not clear about voting? read here.
        </a>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          SUBMIT
        </button>
      </footer>
    </div>
  )
}

export default ContractBuilder5Vote