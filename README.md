
<h1> ROI_FILTER.js</h1>

複雑な形状のROI(関心領域)に対してフィルタをかけることができる,画像処理ライブラリ.
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
</div>


<div id="footer">
	The MIT License (MIT)  Copyright (c) 2015 Yoshiki Shinagawa
</div>
