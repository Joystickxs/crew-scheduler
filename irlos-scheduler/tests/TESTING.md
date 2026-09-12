# Tests

Written test-first (TDD): a failing test goes in here before the
matching fix or feature is added to `src/`.

Run with:

```
npm test
```


Test 1: After testing Demo.js and studying the returned output schedule I noticed a few things that needed to be worked on to reach the desired program for the scheduler: 
1. We need enough staff and events to fill an entire week of events
2. the formatting of the output schedule is terrible, putting aside the lack of stylization to make it seem not like a bunch of returning values because I never did so, the display should show one Monday-Friday completed schedule and under that a log of events that describe what happened throughout the week including all the cases and information, any more is too ugly 
3. There needs to be unavailable days specified for each memeber of staff, I almost want that to be randomized as well(seems like an interesting idea)
4. To conclude, the returning output of the program with multiple schedules walking through each phase and case of the week is too cluttered and honestly barely legible I didn't even understand what I was looking at when I ran it for the first time. I want one clean finished schedule with an organized log of what happened in the week. And enough events and staff so every day has multiple events scheduled