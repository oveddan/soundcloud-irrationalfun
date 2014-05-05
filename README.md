# Soundcloud Logo in Pi Finder
Created by Dan Oved, for the [Irrational Fun: Find Yourself at Berlin Buzzwords contest](https://developers.soundcloud.com/blog/buzzwords-contest)

This application finds the 10 sequences in the first billion digits in pi that most closely approximate the Soundcloud logo.

## The algorithm

It runs as a node.js app, that calculates the sequences most similar to the Soundcloud logo by inserting each sequence of 84 digits into a max heap of size 10, with the comparer being the difference of that sequence from the Soundcloud sequence.  Whenever a sequence is added to the heap, the sequences with the biggest difference is removed from the heap. At the end of the calculation, the 10 sequences with the smallest difference remain in the max heap.

The difference is calculated by comparing digit by digit the absolute value of the difference of each digit in the sequence from the Soundcloud sequence.

## Optimization by distributing processing to multiple cpus

This application takes advantage of the maximum cpus available on the machine it's running on, by distributing the calculation to each cpu.

A process is run on each cpu.  The entire sequence of the billion digits is divided up by the number of available cpus, and each of the smaller subset of digits is given to it's own process, which calculates the 10 closest sequences from that subset.  

When all the processes complete their calculations, the 10 closest sequences from each of the processes are passed to the algorithm again, to reduce the result to the closest 10 from all of processes.

### Number of available cpus for the calculation

If running the application in a web server, this is the total # of cpus minus the cpu used to run the web server.  (On an Macbook Retina this is 8 - 1).

## Setup

Install node.js version 0.10.28, by following the instructions on [nodejs.org](http://nodejs.org).

Download source code using git clone

In source code directory:

    npm install

### Download or copy pi-billion.txt file into source code directory

If you already have the [pi-billion.txt file](http://stuff.mit.edu/afs/sipb/contrib/pi/pi-billion.txt), copy it into the source code directory.

If not, run:

    make downloadpi
to download the file into the source code directory. 

## Run the tests
  
    npm test

## Run the application
  
    npm start

Open http://localhost:3000 in your local browser, and click the button to run the calculations.

Sit back and relax, on a 8 core machine the calculation takes about 114 seconds.

When the calculations are complete, the results will appear on the next page.

## License 

(The MIT License)

Copyright (c) 2014 Dan Oved &lt;stangogh@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
