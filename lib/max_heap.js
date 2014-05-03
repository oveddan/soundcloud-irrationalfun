// code ported from Coursera Algorithms course lecture on priority queues:
// https://d396qusza40orc.cloudfront.net/algs4partI/slides/24PriorityQueues.pdf

exports = module.exports = MaxHeap;

function MaxHeap(size){
  this.pq = [size];
  this.N = 0;
};

MaxHeap.prototype.insert = function(x) {
  pq[++N] = x;
  _swim(N);
}

MaxHeap.prototype.delMax = function() {
  var max = pq[1];
  _exch(1, N--);
  _sink(1);
  pq[N+1] = null;
  return max;
}

MaxHeap.prototype._swim = function(k) {
  while (k > 1 && _less(k/2, k)){
    _exch(k, k/2);
    k = k/2;
  }
}


MaxHeap.prototype._sink = function(k) {
  while (2*k <= N) {
    var j = 2*k;
    if (j < N && _less(j, j+1)) j++;
    if (!_less(k, j)) break;
    _exch(k, j);
    k = j;
  }
}

MaxHeap.prototype._less = function(i, j) { 
  throw "not implemented" 
}

MaxHeap.prototype.exch = function(i, j) {
  var t = pq[i]; 
  var pq[i] = pq[j]; 
  pq[j] = t; 
}