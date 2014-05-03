// code ported from Coursera Algorithms course lecture on priority queues:
// https://d396qusza40orc.cloudfront.net/algs4partI/slides/24PriorityQueues.pdf

exports = module.exports = MaxHeap;

function MaxHeap(size){
  this.pq = [size];
  this.N = -1;
};

MaxHeap.prototype.insert = function(x) {
  this.pq[++this.N] = x;
  this._swim(this.N);
}

MaxHeap.prototype.delMax = function() {
  var max = this.pq[1];
  this._exch(0, this.N--);
  this._sink(0);
  this.pq[this.N+1] = null;
  return max;
}

MaxHeap.prototype.size = function(){
  return this.N + 1;
}

MaxHeap.prototype.all = function(){
  return this.pq.slice(0, this.N + 1);
}

MaxHeap.prototype._swim = function(k) {
  while (k > 1 && this._less(k/2, k)){
    this._exch(k, k/2);
    k = k/2;
  }
}


MaxHeap.prototype._sink = function(k) {
  while (2*k <= this.N) {
    var j = 2*k;
    if (j < this.N && this._less(j, j+1)) j++;
    if (!this._less(k, j)) break;
    this._exch(k, j);
    k = j;
  }
}

MaxHeap.prototype._less = function(i, j) { 
  i.differenceScore < j.differenceScore;
}

MaxHeap.prototype._exch = function(i, j) {
  var t = this.pq[i]; 
  this.pq[i] = this.pq[j]; 
  this.pq[j] = t; 
}