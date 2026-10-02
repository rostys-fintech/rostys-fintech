# Liquidity Clock — Product Lock

## Primary user
Treasury / liquidity-risk manager at a digital-asset financial institution.

## Product question
Can executable liquidity arrive before the current buffer is exhausted?

## Core insight
Liquidity is not only an amount. Under stress, it is a race between outflow velocity and execution time.

## Product definition
Liquidity Clock is a real-time stress engine that compares how fast liquidity is being consumed with how fast reserve sources can actually become executable, then identifies the timing gap and the fastest viable intervention.

## Hard exclusions
No portfolio management, trading terminal, custody, insolvency prediction, universal liquidity ratio, bank-run prediction, unpublished R3/JFS reproduction, or generic chatbot.
