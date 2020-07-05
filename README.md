Your task is to solve <font size="+1">N x M Systems of Linear Equations (LS)</font> and to determine the <b>complete solution space</b>.<br>&nbsp;<br>Normally an endless amount of solutions exist, not only one or none like for N x N. You have to handle <b>N</b> unkowns and <b>M</b> equations (<b>N>=1</b>, <b>M>=1</b>) and your result has to display all numbers in <b>'reduced fraction representation'</b> too (perhaps first you can try my <a href="http://www.codewars.com/kata/solving-linear-equations-n-x-n-gauss-part-1-slash-2" target=_blank>N x N kata</a>). More about LS you can find <a href="https://en.m.wikipedia.org/wiki/System_of_linear_equations" target=_blank><b>here</b></a> or perhaps is already known.<br>&nbsp;<br>
<b>First of all two easy examples:</b><br>

<li><code>1&#42;x1 + 2&#42;x2 + 0&#42;x3 + 0&#42;x4 = 7</code></li>
<li><code>0&#42;x1 + 3&#42;x2 + 4&#42;x3 + 0&#42;x4 = 8</code></li>
<li><code>0&#42;x1 + 0&#42;x2 + 5&#42;x3 + 6&#42;x4 = 9</code></li>

<br><code>SOL=(97/15; 4/15; 9/5; 0) + q1\* (-16/5; 8/5; -6/5; 1)</code><br>&nbsp;<br>
You can see the dimension of solution space is 1 (it's a line) and q1 is any real number, so we have endless solutions. You can insert every single solution into every equation and all are correctly solved (1\*97/15 + 2\*4/15 + 0 + 0 =7 for q1=0).<br>&nbsp;<br>
Second example:<br>

<li><code>1&#42;x1 + 5/2&#42;x2 + 1/2&#42;x3 + 0&#42;x4 + 4&#42;x5 = 1/8</code></li>
<li><code>0&#42;x1 + 5&#42;x2 + 2&#42;x3 - 5/2&#42;x4  + 6&#42;x5 = 2</code></li>

<br><code>SOL=(-7/8; 2/5; 0; 0; 0) + q1 \* (1/2; -2/5; 1; 0; 0) + q2 \* (-5/4; 1/2; 0; 1; 0) + q3 \* (-1; -6/5; 0; 0; 1)</code>
<br>&nbsp;<br>
Here you can see the dimension of the solution is 3, q1, q2 and q3 are arbitrary real numbers. You can see all resulting numbers are in <b>fraction representation</b> (which is easier to read and handle for pupils/students), whatever the input was.<br>&nbsp;<br>
<b>So what is missing?</b><br>&nbsp;<br>
You have to build a function <code>"Solve(input)"</code> (or <code>"solve(input)"</code>) which takes the equations as an input string and returns the solution as a string. "\n" (LF) separates equations, "&nbsp;" (SPACE) separates the numbers (like <b>3</b> or <b>4/5</b>, only the coefficients not the <b>xi</b>'s), each last number per line is the number behind the &#61; (the equation result, see examples). The result of the function is the solution given as a string. All test examples will be syntactically correct, so you don't need to take care of it.
<br>&nbsp;<br>So for the first example you have to call: <code>Solve ("1 2 0 0 7\n0 3 4 0 8\n0 0 5 6 9")</code>. The result of Solve is <code>"SOL=(97/15; 4/15; 9/5; 0) + q1 \* (-16/5; 8/5; -6/5; 1)"</code>, exactly in this form/syntax. (97/15; 4/15; 9/5; 0) + q1 \* <i>(16/5; -8/5; 6/5; -1)</i> is ok too because it produces same solutions.<br>&nbsp;<br>Spaces in your result are allowed, but not necessary. You have to use '<b>q</b>i' (i from 1 to dimension) standing for the real numbers (the first starting solution- point/vector has no q). If the dimension of the solution is greater than 1, the order of the qi- vectors isn't important (but all indices should be in order, that is, 'q1' first then 'q2', etc.). The fractions have to be <b>reduced as much as possible</b> (but not 4/3 to 1&nbsp;1/3). If there exists no solution you have to respond with <code>"SOL=NONE"</code>. If only one solution exists the response should contain no 'qi'-vectors (e.g.,<code>"SOL=(1; 2; 3)"</code>).<br>&nbsp;<br>
<b>One last word to the tests:</b><br>
The test function checks the syntax of your output, uses some rules for different verifications and after all checks the given equations with your solution and verifies that all equations are satisfied for arbitrary values of qi's. If all things fit together, your solution is accepted! If not, you will get a hint 'why not'...
<br>&nbsp;</br>
<b>Hint:</b> don't rely on floating-point numbers to solve this kata. Use exact rational arithmetic.
<br>&nbsp;<br>

<h2><font color="red">Hope you have fun:-)!</font></h2>
