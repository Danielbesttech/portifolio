<?php

echo "teste php";
function FizzBuzz($n){

  for($i = 1 ; $i<=$n; $i++){
    $m3 = $i % 3;
    $m5 = $i % 5;

    if($m3 !=0 && $m5 !=0){
      echo '<br/>';

      // print_r('Não são divisíveis');
      echo '<br/>';
      print_r($i);
      echo '<br/>';

    }else {
      if($m3 == 0 && $m5 == 0 ){
        print_r('FizzBuzz');
      echo '<br/>';

      }if($m3 == 0 && $m5 != 0 ){
        print_r('Fizz');
      echo '<br/>';

      }if($m5 == 0 && $m3 != 0)
        print_r('Buzz');
      echo '<br/>';

    }
  }

}



$n = intval(trim(15));


FizzBuzz($n);

?>
