# 替换wp-includes/class-wp-xmlrpc-server.php
# 需要把文件放到wordpress下执行
path=wp-includes/class-wp-xmlrpc-server.php
text4='$upload_err = apply_filters'
text5='\t\tif ( !empty($data['\'overwrite\'']) && ($data['\'overwrite\''] == true) ) {\n\t\t\t$old_file = $wpdb->get_row("SELECT ID FROM {$wpdb->posts} WHERE post_title = '\'{\$name}\'' AND post_type = '\'attachment\'' "); \n\t\t\twp_delete_attachment($old_file->ID);\n\t\t}'
sed -i '/'"$text4"'/i\'"$text5"'' $path
