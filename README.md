
<h1> ROI_FILTER.js</h1>

複雑な形状のROI(関心領域)に対してフィルタをかけることができる,画像処理ライブラリ.

<div align="center">
	<img src="https://github.com/s-yoshiki/ROI_FILTER.js/blob/master/picture/sample.png" width="256" height="256">
</div>

<div>
	<a href="http://jsrun.it/s.yoshiki1123/0EQI">DEMO</a>
</div>
<div>
	--サポートブラウザ--
	<ul>
		<li>Chrome</li>
		<li>Firefox</li>
		<li>Safari</li>
		<li>Opera</li>
	</ul>
	(2015/11/22 現在の最新版)
</div>

<div id="main">
	<div id="">
		<h3>はじめに</h3>
		
		<pre>
var roi = new ROI_FILTER("canvas_id");

		</pre>
	</div>

	<div id="">
		<h3>画像を書き込む</h3>
		
		<pre>
var image = new Image();
image.src = "./picture/lena.png";
roi.setImage(image, 512, 512);
		</pre>
	</div>

	<div>
		<h3>画像全体にフィルタをかける</h3>

		<p>砂嵐</p>
		<pre>
roi.sandstorm();
		</pre>

		<p>グレースケール変換</p>
		<pre>
roi.grayscale();
		</pre>

		<p>２値化</p>
		<pre>
roi.threshold(THRESHOLD);
		</pre>

		<p>画像配列 R,G,Bに対してr,g,bを掛ける(R*r ,G*g B*b).反映されるのは0〜255まで</p>
		<pre>
roi.scalar(r,g,b);
//exsample
roi.scalar(1.0 ,1.3 ,0.8);
		</pre>

		<p>3x3のcanny edgeフィルタ</p>
		<pre>
roi.canny(THRESHOLD);
		</pre>

		<p>3x3のlaplacianフィルタ</p>
		<pre>
roi.laplacian();
		</pre>

		<p>ネガポジ反転</p>
		<pre>
roi.reverse();
		</pre>

		<p>画像配列 R,G,Bに対してr,g,bで塗りつぶす(R=r,G=g,B=b).反映されるのは0以上の時/p>
		<pre>
roi.fill(r,g,b);
//exsample
roi.fill(20,50,100);
roi.fill(20,50,-1);//Bは反映されない
		</pre>

		<p>画像配列 R,G,Bのフィルタの値を交換</p>
		<pre>
roi.change("r","g","b");
//exsample
roi.change("g","b","r");
roi.change("r","r","b");
roi.change("g","g","g");
		</pre>

		<p>3x3 gaussian フィルタ</p>
		<pre>
roi.gaussian();
		</pre>

		<p>3x3 平滑化 フィルタ</p>
		<pre>
roi.average();
		</pre>

		<p>3x3 median フィルタ</p>
		<pre>
roi.average();
		</pre>
	</div>

	<div>
		<h3>短形にフィルタをかける</h3>

		<p>砂嵐</p>
		<pre>
roi.rect.sandstorm(x,y,w,h);
		</pre>

	</div>

	<div>
		<h3>円形(楕円)にフィルタをかける</h3>

		<p>砂嵐</p>
		<pre>
roi.circle.sandstorm(x,y,w,h);
		</pre>
	</div>

	<div>
		<h3>三角形にフィルタをかける</h3>

		<p>砂嵐</p>
		<pre>
roi.triangle.sandstorm(x1,y1,x2,y2,x3,y3);
		</pre>
	</div>

	<div>
		<h3>指定した形状にフィルタをかける</h3>

		<p>砂嵐</p>
		<pre>
roi.polygon.sandstorm([x1,x2,x3...xn],[y1,y2,y3...yn]);
		</pre>
	</div>

	<div>
		<h3>菱形にフィルタをかける</h3>

		<p>砂嵐</p>
		<pre>
roi.daiamond.sandstorm(x1,y1,x2,y2,x3,y3);
		</pre>
	</div>

</div>


<div id="footer">
	Copyright © 2015 Yoshiki Shinagawa Licensed under the MIT License
</div>
